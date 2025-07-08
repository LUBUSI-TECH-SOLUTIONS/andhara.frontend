import AuthForm from "@/features/auth/components/AuthForm"

const AuthPage = () => {
  
  return (
    <section className="h-screen lg:flex">
      <figure className="lg:w-[70vw] hidden lg:block relative">
        <img
          loading="lazy"
          decoding="async"
          src="./img/auth-cover-desktop.jpg"
          alt="Auth Background"
          className="w-full h-full object-cover"
        />
      </figure>
      <section className='lg:w-[30vw] flex flex-col h-full justify-center items-center lg:shadow-[inset_10px_0px_6px_0px_rgba(0,_0,_0,_0.2)]'>
      <figure className="flex flex-col items-center justify-center gap-y-5">
        <img
          loading="lazy"
          width={150}
          height={150}
          src="./img/logo.svg"
          alt="Auth Background"
          className=""
        />
        <figcaption>
          <h2 className="font-bold uppercase text-3xl">Iniciar sesión</h2>
        </figcaption>
        </figure>
        <AuthForm />
      </section>
    </section>
  )
}

export default AuthPage