import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuthentication } from "../authentication"
import { useNavigate } from "react-router-dom"

export function LoginPage() {
	const navigate = useNavigate()

	const [user, login, logout, refresh] = useAuthentication()

	const [statusMessage, setStatusMessage] = useState("")
	const [formData, setFormData] = useState({
		email: "test2@abc.com",
		password: "abc123"
	})

	function onLoginSubmit(e) {
		e.preventDefault()
		setStatusMessage("Logging in...")

        
		login(formData.email, formData.password)
			.then(result => {
				setStatusMessage("Login successful!")
				navigate("/classes")
			})
			.catch(error => {
				setStatusMessage(error)
			})
	}

	// Need useState for Login and Register

	return <>
		<div className="bg-background-primary min-h-screen">
			<main className="mx-4 pt-28 min-h-screen flex items-center flex-col">

				<div>
					<img src="/logo.png" alt="High Street gym logo" className="h-44"/>
				</div>

				<div className="flex justify-center mt-5">
					<div className="card w-full bg-base-100 shadow-xl md:w-96">
						
						<form className="p-5" onSubmit={onLoginSubmit}>
							<span className="text-2xl font-bold p- flex justify-center">Login</span>
							<label className="input input-bordered flex items-center gap-2 m-4">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" /><path d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" /></svg>
								<input type="email" className="grow" placeholder="Email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value})}/>
							</label>
							<label className="input input-bordered flex items-center gap-2 m-4">
								<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 opacity-70"><path fillRule="evenodd" d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z" clipRule="evenodd" /></svg>
								<input type="password" className="grow" placeholder="●●●●●●●" value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})}/>
							</label>

							<div className="flex justify-center gap-2">
								<button className="btn btn-ghost border-test">Login</button>
								<Link to={"/register"} className="btn btn-ghost">
									Sign up
								</Link>
							</div>
							<label className="label mt-2 flex justify-end">
								<span className="label-text-alt">{statusMessage}</span>
							</label>
							
						</form>
					</div>
				</div>
			</main>
		</div>
	</>
}

export default LoginPage