
export function MobilePageHeader({pageTitle}) {
    return <>
        <div className="card shadow my-4 p-6 bg-neutral-200 md:w-96 m-auto">
            <h3 className="text-4xl flex justify-center font-extrabold tex">{pageTitle}</h3>
        </div>
    </>
}