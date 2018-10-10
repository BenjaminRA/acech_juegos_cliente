import React from 'react'

export default ({open, handleClose}) => 
  <div className="Mobile-Warnign" style={{display: open ? 'block' : 'none'}} onClick={() => handleClose()}>
    <div className="Mobile-Warnign-content">
      <p>
        Para poder entrar a estos juegos debes estar conectado a un computador.<br/>
        Ingrese la ID de su máquina en el cuadro de texto ubicada en el encabezado de la página y presione "conectar"
      </p>
    </div>
  </div>