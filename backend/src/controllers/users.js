import { Router } from "express";
import bcrypt from "bcryptjs"
import { v4 as uuid4 } from "uuid"
import * as Users from "../models/users.js";
import xml2js from "xml2js"
import auth from "../middleware/auth.js";
import validator from "validator";



// TODO: Implement Validation

const userController = Router()

userController.post("/login", (req, res) => {
    // Access request body
    let loginData = req.body;

    // TODO: Implement request validation

    Users.getByEmail(loginData.email)
        .then(user => {

            if (bcrypt.compareSync(loginData.password, user.password)) {
                user.authenticationKey = uuid4().toString();

                Users.update(user)
                    .then(result => {
                        res.status(200).json({
                            status: 200,
                            message: "User logged in",
                            authenticationKey: user.authenticationKey,
                        });
                    })
                    .catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "Failed to update user",
                        });
                    });
            } else {
                res.status(400).json({
                    status: 400,
                    message: "Invalid credentials",
                });
            }
        })
        .catch(error => {
            res.status(500).json({
                status: 500,
                message: "Login failed",
            });
        });
});


userController.post("/logout", (req, res) => {
    const authenticationKey = req.get("X-AUTH-KEY")
    Users.getByAuthenticationKey(authenticationKey)
        .then(user => {
            user.authenticationKey = null
            Users.update(user).then(user => {
                res.status(200).json({
                    status: 200,
                    message: "User logged out"
                })
            })
        }).catch(error => {
            res.status(500).json({
                status: 500,
                message: "Failed to logout user"
            })
        })
})


userController.get("/", auth(["trainer"]), async (req, res) => {
    const users = await Users.getAll()

    // if (users.length > 0)
    res.status(200).json({
        status: 200,
        message: "Successfully retrieved users",
        users: users
    })
})


userController.get("/:id", (req, res) => {
    const userId = req.params.id

    // TODO: Implement request validation

    // TODO: Enforce that moderator
    // and spotter users can only get themselves

    Users.getById(userId).then(user => {
        res.status(200).json({
            status: 200,
            message: "User found",
            user: user
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get user by Id: " + {userId}
        })
    })
})

userController.get("/authentication/:authenticationKey", (req, res) => {
    const authenticationKey = req.params.authenticationKey

    Users.getByAuthenticationKey(authenticationKey).then(user => {
        res.status(200).json({
            status: 200,
            message: "User found",
            user: user,
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to get user by authentication key",
        })
    })
})


userController.post("/", (req, res) => {
    // Get the data out of the request
    const userData = req.body.user
    const authenticationKey = req.get("X-AUTH-KEY")

    // TODO: Implement request validation

    // hash the password if it isnt already hashed
    if (!userData.password.startsWith("$2a")) {
        userData.password = bcrypt.hashSync(userData.password);
    }

    // Convert the user data into a User model object
    const user = Users.newUser(
        null,
        userData.email,
        userData.password,
        userData.role,
        userData.phone,
        userData.first_name,
        userData.last_name,
        userData.address,
        authenticationKey,
    )

    // Use the create model function to insert this into the DB
    Users.create(user).then(user => {
        res.status(200).json({
            status: 200,
            message: "User created",
            user: user
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to create user"
        })
    })
})


userController.post("/register", (req, res) => {
    // Get the user data out of the request
    const userData = req.body

    if (!/[a-zA-Z-]{2,}/.test(userData.first_name)) {
        res.status(400).json({
          status: 400,
          message: "Invalid first name",
        });
        return;
      }
    
      if (!/[a-zA-Z-]{2,}/.test(userData.last_name)) {
        res.status(400).json({
          status: 400,
          message: "Invalid last name",
        });
        return;
      }
    
      if (!/^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/.test(userData.phone)){
        res.status(400).json({
          status: 400,
          message: "Invalid phone number",
        });
        return;
      }
    
      if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(userData.email)) {
        res.status(400).json({
          status: 400,
          message: "Invalid email ",
        });
        return;
      }
    
      if (!userData.password) {
        res.status(400).json({
          status: 400,
          message: "Invalid password ",
        });
        return;
      } else {
        userData.password = bcrypt.hashSync(userData.password);
      }
    
      const validatedUser = Users.newUser(
        null,
        validator.escape(userData.email),
        userData.password,
        "guest",
        validator.escape(userData.phone),
        validator.escape(userData.first_name),
        validator.escape(userData.last_name),
        validator.escape(userData.address),
        null
      );

    // Use the create model function to insert this user into the DB
    Users.create(validatedUser).then(user => {
        res.status(200).json({
            status: 200,
            message: "Registration successful",
            user: user
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Registration failed",
        })
    })
})

userController.post("/upload-xml", auth(["trainer"]), (req, res) => {
    if (req.files && req.files["xml-file"]) {
        // Access the XML file as a string
        const XMLFile = req.files["xml-file"]
        const file_text = XMLFile.data.toString()

        // Set up XML parser
        const parser = new xml2js.Parser();
        parser.parseStringPromise(file_text)
            .then(data => {
                const userUpload = data["user-upload"]
                const userUploadAttributes = userUpload["$"]
                const operation = userUploadAttributes["operation"]
                // Slightly painful indexing to reach nested children
                const usersData = userUpload["users"][0]["user"]

                if (operation == "insert") {
                    Promise.all(usersData.map((userData) => {
                        // Convert the xml object into a model object
                        const userModel = Users.newUser(
                            null, 
                            userData.email.toString(),
                            userData.password,
                            userData.role.toString(),
                            userData.phone,
                            userData.first_name.toString(),
                            userData.last_name.toString(),
                            userData.address.toString(),
                            null
                        )
                        // Return the promise of each creation query
                        return Users.create(userModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload insert successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })
                } else if (operation == "update") {
                    Promise.all(usersData.map((userData) => {
                        // Convert the xml object into a model object
                        const userModel = Users.newUser(
                            null, 
                            userData.email.toString(),
                            userData.password,
                            userData.role.toString(),
                            userData.first_name.toString(),
                            userData.last_name.toString(),
                            userData.address.toString(),
                            null                  )
                        // Return the promise of each creation query
                        return Users.update(userModel)
                    })).then(results => {
                        res.status(200).json({
                            status: 200,
                            message: "XML Upload update successful",
                        })
                    }).catch(error => {
                        res.status(500).json({
                            status: 500,
                            message: "XML upload failed on database operation - " + error,
                        })
                    })

                } else {
                    res.status(400).json({
                        status: 400,
                        message: "XML Contains invalid operation attribute value",
                    })
                }
            })
            .catch(error => {
                res.status(500).json({
                    status: 500,
                    message: "Error parsing XML - " + error,
                })
            })


    } else {
        res.status(400).json({
            status: 400,
            message: "No file selected",
        })
    }
})

userController.patch("/:id", async (req, res) => {
    const userId = req.params.id;
    const { first_name, last_name, address, phone, password } = req.body.formData;
    // Construct the user object with only the fields you want to update
    const userData = { id: userId, role: "guest", first_name, last_name, address, phone, password };

    console.log(userData)

    if (!/[a-zA-Z-]{2,}/.test(userData.first_name)) {
        res.status(400).json({
          status: 400,
          message: "Invalid first name",
        });
        return;
      }
    
      if (!/[a-zA-Z-]{2,}/.test(userData.last_name)) {
        res.status(400).json({
          status: 400,
          message: "Invalid last name",
        });
        return;
      }
    
      if (!/^(?:\+?(61))? ?(?:\((?=.*\)))?(0?[2-57-8])\)? ?(\d\d(?:[- ](?=\d{3})|(?!\d\d[- ]?\d[- ]))\d\d[- ]?\d[- ]?\d{3})$/.test(userData.phone)) {
        res.status(400).json({
          status: 400,
          message: "Invalid phone number",
        });
        return;
    }
    
    if (!userData.password.startsWith("$2a")) {
      userData.password = bcrypt.hashSync(userData.password);
    }
    
    
        // Convert the user data into a User model object
        const user = Users.newUser(
            userData.id,
            userData.email,
            userData.password,
            userData.role,
            userData.phone,
            userData.first_name,
            userData.last_name,
            userData.address,
            userData.authenticationKey
        )

    
    // console.log(userData)

    // const validatedUser = Users.newUser(
    //   userData.id,
    //   validator.escape(userData.email),
    //   userData.password,
    //   validator.escape(userData.role),
    //   validator.escape(userData.phone),
    //   validator.escape(userData.first_name),
    //   validator.escape(userData.last_name),
    //   userData.address,
    //   userData.authenticationKey
    // );
  
    console.log(user)
    // Use the update model function to update this user in the DB
    Users.update(user)
        .then(user => {
            res.status(200).json({
                status: 200,
                message: "Updated user",
                user: user
            });
        })
        .catch(error => {
            console.log(error);
            res.status(500).json({
                status: 500,
                message: "Failed to update user with Id: " + userId,
            });
        });
});

userController.delete("/:id", auth(["trainer"]), (req, res) => {
    const userId = req.params.id

    // TODO: Implement request validation

    Users.deleteById(userId).then(result => {
        res.status(200).json({
            status: 200,
            message: "User deleted",
        })
    }).catch(error => {
        res.status(500).json({
            status: 500,
            message: "Failed to delete user",
        })
    })
}
)

export default userController