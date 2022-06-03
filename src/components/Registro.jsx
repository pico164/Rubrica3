import React from 'react'
import { db } from '../firebase'

const Registro = (props) => {
  //hooks
  const [categoriaP,setCategoriaP]=React.useState('')
  const [tipoServicio,setTipoServicio]=React.useState('')
  const [descripcion,setDescrip] = React.useState('')
  const [ubicacion,setUbicacion] = React.useState('')
  const [id,setId] = React.useState('')
  const [lista,setLista] = React.useState([])
  const [error,setError] = React.useState('')
  const [modoEdicion,SetModoEdicion] = React.useState(false)
  let mostrar = '';
  
  React.useEffect(()=>{
    const obtenerDatos = async()=>{
      try {
        const data= await db.collection(props.user.email).get()
        //console.log(data.docs)
        const arrayData= data.docs.map(doc=>({id:doc.id,...doc.data()}))
        console.log(arrayData);
        setLista(arrayData)
      } catch (error) {
        console.log(error)
      }
    }
    obtenerDatos()
  },[])

  const guardarDatos = async (e)=>{
    e.preventDefault()
    if (!descripcion.trim()) {
        setError('La descripcion no debe quedar vacio')
      return
    }
    if (!ubicacion.trim()) {
        setError('La ubicacion no debe quedar vacio')
      return
    }
    if (!categoriaP.trim()) {
        setError('Seleccione un tipo de categoria')
        return
      }

    if (!tipoServicio.trim()) {
        setError('Seleccione un tipo de servicio')
      return
    }

    console.log(descripcion+' '+ubicacion)

    try {
      const nuevoUsuario= {
        descripcion,ubicacion,categoriaP,tipoServicio
      }
      const dato= await db.collection(props.user.email).add(nuevoUsuario)

      setLista([
        ...lista,
        {...nuevoUsuario,id:dato.id}
      ])

    } catch (error) {
      console.log(error);
    }

    setDescrip('')
    setCategoriaP('')
    setTipoServicio('')
    setUbicacion('')
    setError('')
    
  }

  const eliminarDato=async(id)=>{
    try {
      await db.collection(props.user.email).doc(id).delete()
      const listaFiltrada = lista.filter((elemento)=>elemento.id!==id)
      setLista(listaFiltrada)
    } catch (error) {
      console.log(error)
    }
  }

  const editar=(elemento)=>{
    SetModoEdicion(true)
    setId(elemento.id)
    setCategoriaP(elemento.categoriaP)
    setTipoServicio(elemento.tipoServicio)
    setDescrip(elemento.descripcion)
    setUbicacion(elemento.ubicacion)
  }

  const editarDatos=async(e)=>{
    e.preventDefault()

    if (!descripcion.trim()) {
        setError('La descripcion no debe quedar vacio')
      return
    }
    if (!ubicacion.trim()) {
        setError('La ubicacion no debe quedar vacio')
      return
    }
    if (!categoriaP.trim()) {
        setError('Seleccione un tipo de categoria')
        return
      }

    if (!tipoServicio.trim()) {
        setError('Seleccione un tipo de servicio')
      return
    }

    try {
      await db.collection(props.user.email).doc(id).update({
        categoriaP,descripcion,ubicacion
      })

      const listaEditada=lista.map((elemento)=>elemento.id===id ?
      {id:id,descripcion:descripcion,ubicacion:ubicacion,categoriaP:categoriaP,tipoServicio:tipoServicio} : elemento
      )

      setLista(listaEditada)

      SetModoEdicion(false)
      setTipoServicio('')
      setCategoriaP('')
      setDescrip('')
      setUbicacion('')
      setId('')
      setError(null)

    } catch (error) {
      console.log(error)
    }

  }

    if (categoriaP==='Servicios') {
        mostrar=<><option>Aseo</option>
        <option>Transporte</option>
        <option>Vigilancia</option></> 
    }else
        if(categoriaP==='Mantenimiento de Muebles'){
            mostrar=<><option>Aire Acondicionado</option>
            <option>Archivador</option>
            <option>Puesto de Trabajo</option>
            <option>Silla</option></> 
        }else
            if(categoriaP==='Mantenimiento de Inmuebles'){
                mostrar=<><option>Baños</option>
                <option>Cielo Raso</option>
                <option>Electrico</option>
                <option>Pared</option>
                <option>Puerta</option></> 
            }  

  return (
    <div className="container">
      <div className="row">
        <div className="col-12">
          <h2 className="text-center">{modoEdicion ? 'Edicion de Requerimientos': 'Registro de Requerimientos'}</h2>
          <form onSubmit={modoEdicion ? editarDatos: guardarDatos}>
            {
              error ? (
                <div className="alert alert-danger" role={alert}>
                  {error}
                </div>
              ):
              null
            }
            <select className='form-select mb-2' onChange={(e)=>{setCategoriaP(e.target.value)}}>
                <option selected>Seleccione el tipo de requerimiento</option>
                <option>Mantenimiento de Inmuebles</option>
                <option>Mantenimiento de Muebles</option>
                <option>Servicios</option>
            </select>

            <select className='form-select mb-2' onChange={(e)=>{setTipoServicio(e.target.value)}}>
                <option selected>Seleccione el tipo de Servicio</option>
                {mostrar}              
            </select>
            <input type="text" placeholder="Ingrese la descripcion" className="form-control mb-2" onChange={(e)=>{setDescrip(e.target.value)}} value={descripcion}/>
            <input type="text" placeholder="Ingrese hacia donde va dirigido el servicio" className="form-control mb-2" onChange={(e)=>{setUbicacion(e.target.value)}} value={ubicacion}/>
            <div className="d-grid gap-2">
              {
                modoEdicion ? <button className="btn btn-outline-warning" type="submit">Editar</button>:
                <button className="btn btn-outline-info" type="submit">Agregar</button>
              }
            </div>
          </form>
        </div>  
      </div>
      <hr/>
      <div className="row">
        <div className="cold-12">
          <h2 className="text-center">Lista Solicitudes</h2>
          <ul className="list-group">
            {
              lista.map(
                (elemento)=>(
                  <li className="list-group-item" key={elemento.id}> <b>Descripcion :</b> {elemento.descripcion} <b>Ubicacion :</b> {elemento.ubicacion}  <b>Categoria :</b> {elemento.categoriaP} <b>Servicio :</b> {elemento.tipoServicio}
                  <button className="btn btn-success float-end mx-2" onClick={()=>editar(elemento)} >Editar</button>
                  <button className="btn btn-danger float-end mx-2" onClick={()=>eliminarDato(elemento.id)}>Eliminar</button>
                  </li>
                )
              )
            }
          </ul>
        </div>
      </div>
    </div>
  );
}

export default Registro