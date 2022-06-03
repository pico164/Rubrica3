import React from 'react'
import {db,auth} from '../firebase'
import { useNavigate } from 'react-router-dom'


const Login = () => {
    const [modoRegistro,setModoRegistro]=React.useState(true)
    const [email,setEmail]=React.useState('lp@gmail.com')
    const [pass,setPass]=React.useState('123456')
    const [error,setError]=React.useState(null)
    const navigate=useNavigate()

    const guardarDatos=(e)=>{
      e.preventDefault()
      if (!email.trim()) {
        setError('Ingrese el email')
        return
      }

      if(!pass.trim()){
        setError('Ingrese la contraseña')
        return
      }

      if (pass.length<6) {
        setError('Contraseña debe tener minimo 6 caracteres')
        return
      }

      setError(null)

      if (modoRegistro) {
        registrar()
      }else{
        login()
      }
    }

    const login=React.useCallback(async()=>{
      try {
        const res= await auth.signInWithEmailAndPassword(email,pass)
        console.log(res.user)
        setEmail('')
        setPass('')
        setError(null)
        navigate("/admin")
      } catch (error) {
        console.log(error)
        if (error.code==='auth/invalid-email') {
          setError('Email no es valido')
        }
        if (error.code==='auth/user-not-found') {
          setError('Usuario no registrado')
        }
      }
    },[email,pass,navigate])

    const registrar=React.useCallback(async()=>{
      try {
        const res= await auth.createUserWithEmailAndPassword(email,pass)
        console.log(res.user)
        await db.collection('usuariosdb').doc(res.user.email).set(
          {
            email:res.user.email,
            id:res.user.uid
          }
        )
        await db.collection(res.user.uid).add()
        setEmail('')
        setPass('')
        setError(null)
        navigate("/admin")
      } catch (error) {
        console.log(error)
        if (error.code==='auth/invalid-email') {
          setError('Email no es valido')
        }
        if (error.code==='auth/email-already-in-use') {
          setError('Usuario ya existe')
        }
        if (error.code==='auth/wrong-password') {
          setError('Contraseña Incorrecta')
        }
      }
    },[email,pass,navigate])

  return (
    <div>
      <h3 className='text-center'>
      {
        modoRegistro ?'Registro de usuarios' : 'Login'
      }</h3>
      <div className="row justify-content-center">
        <div className='col-12 col-sm-10 col-md-6 col-xl-4'>
          <form onSubmit={guardarDatos}>
            {
              error && (
                <div className='alert alert-danger'>{error}</div>
              )
            }
            <input type="email" className='form-control mb-3' placeholder='Ingrese su email' onChange={e=>setEmail(e.target.value)} value={email}/>
            <input type="password" className='form-control mb-3' placeholder='Ingrese su contraseña' onChange={e=>setPass(e.target.value)} value={pass}/>
            <div className='d-grid gap-2'>
              <button className='btn btn-primary'>
                {
                  modoRegistro ? 'Registrarse':'Ingresar'
                }
              </button>
              <button className='btn btn-primary' type='button' onClick={()=>{setModoRegistro(!modoRegistro)}}>
                {
                  modoRegistro ? 'Ya estas registrado?':'No tienes cuenta?'
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login