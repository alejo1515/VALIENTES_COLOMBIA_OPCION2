const { app, BrowserWindow, ipcMain } = require('electron');
const { getConnection } = require('./basededatos');
const path = require('path');
const { type } = require('os');




//funciones para direccionar las librerias
//botones
ipcMain.on('volver-al-menu', () => {
    window.loadFile(path.join(__dirname, 'menu/menu_principal.html'));
});

ipcMain.on('ir-al-menu', () => {
    window.loadFile(path.join(__dirname, 'menu/menu_principal.html'));
});

ipcMain.on('ir-al-registro', () => {
    window.loadFile(path.join(__dirname, 'registros/registro.html'));
});

ipcMain.on('ir-al-registrar_caso', () => {
    window.loadFile(path.join(__dirname, 'registrar caso/registrar_Caso.html'));
});

ipcMain.on('ir-a-consultaSobreviviente', () => {
    window.loadFile(path.join(__dirname, 'consultar sobreviviente/consultar_sobreviviente.html'));
});

ipcMain.on('ir-a-consultarcaso', () => {
    window.loadFile(path.join(__dirname, 'consultar caso/consultar_caso.html'));
});

ipcMain.on('ir-a-registrarseguimiento', () => {
    window.loadFile(path.join(__dirname, 'registar seguimiento/registro_seg_tipo.html'));
});

ipcMain.on('ir-al-registroSegMicro', () => {
    window.loadFile(path.join(__dirname, 'registar seguimiento/registro seguimiento micro/registrar_seguimiento.html'));
});
ipcMain.on('ir-al-registroSegMacro', () => {
    window.loadFile(path.join(__dirname, 'registar seguimiento/registro seguimiento macro/registrar_seguimientoMacro.html'));
});



ipcMain.on('ir-a-consultarseguimiento', () => {
    window.loadFile(path.join(__dirname, 'consultar seguimiento/consultar_seguimiento.html'));
});


ipcMain.on('ir-al-GraficoMacro', () => {
    window.loadFile(path.join(__dirname, 'registar seguimiento/graficas macro/graficos.html'));
});


ipcMain.on('ir-al-GraficoMicro', () => {
    window.loadFile(path.join(__dirname, 'registar seguimiento/graficas micro/graficos.html'));
});



ipcMain.on('ir-a-estadisticabutton', () => {
    window.loadFile(path.join(__dirname, 'graficas/graficos.html'));
});

ipcMain.on('ir-a-cuentasusuario', () => {
    window.loadFile(path.join(__dirname, 'cuentas de usuarios/cuentas_usuario.html'));
});

ipcMain.on('ir-a-cerrarSesion', () => {
    window.loadFile(path.join(__dirname, 'loginhtml.html'));
});

ipcMain.on('ir-al-graficaMicrofactor', () => {
    window.loadFile(path.join(__dirname, 'registar seguimiento/graficas individuales micro/graficos.html'));
});


ipcMain.on('ir-al-graficaMacrofactor', () => {
    window.loadFile(path.join(__dirname, 'registar seguimiento/graficas individuales macro/graficos.html'));
});




ipcMain.on('ir-al-cambioclave', () => {
    window.loadFile(path.join(__dirname, 'cuentas de usuarios/CAMBIO CLAVE/cambioclave.html'));

});


    ipcMain.on('ir-al-registrousuario', () => {
        window.loadFile(path.join(__dirname, 'cuentas de usuarios/CREAR USUARIO/cuentausuario.html')); 
});
//funcion login

let sesionActiva = null;



async function login(loginc) {
    try {
        const conn = await getConnection(); 
        // Consulta estándar compatible con SQLite
        const sql = 'SELECT * FROM usuarios WHERE USERNAME = ? AND PASSWORD = ?';
    
        // 📌 CAMBIO CLAVE: Usamos .get() porque buscamos un único registro.
        // Quitamos los corchetes [rows] ya que SQLite devuelve el objeto directamente.
        const usuarioEncontrado = await conn.get(sql, [loginc.NAME, loginc.CLAVE]);

        // Si el usuario existe en la base de datos (no es undefined)
        if (usuarioEncontrado) {
            sesionActiva = usuarioEncontrado;
            return usuarioEncontrado; 
        } else {
            sesionActiva = null;
            return null; 
        }
    } catch (error) {
        console.error("Error en la consulta SQL de SQLite:", error);
        return null;
    }
}

// Handler login (Este se queda EXACTAMENTE IGUAL)
ipcMain.handle('login', async (event, newloginc) => {
    try {
        const usuario = await login(newloginc); 
        return usuario; 
    } catch (error) {
        console.error("Error en el handler de login:", error);
        return null;
    }
});


ipcMain.handle('quien-es-el-usuario', () => {
    return sesionActiva;
});



async function registro(registror) {
    let conn;
    try {
        conn = await getConnection(); 
        const sql = 'INSERT INTO sobrevivientes (NOMBRES, FECHA_NACIMIENTO, CIUDAD, LUGAR_NACIMIENTO, EPS, TIPO_AFILIACION_EPS, OCUPACION, NIVEL_EDUCATIVO) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        
        const valores = [
            registror.NOMBRES,
            registror.FECHA_NACIMIENTO,
            registror.CIUDAD,
            registror.LUGAR_NACIMIENTO,
            registror.EPS,
            registror.TIPO_AFILIACION_EPS,
            registror.OCUPACION,
            registror.NIVEL_EDUCATIVO
        ];
        
        const [result] = await conn.query(sql, valores);

        if (result.affectedRows > 0) {
            console.log("Registro exitoso.");
            return { success: true, id: result.insertId };
        } else {
            return { success: false, error: "No se pudo registrar el sobreviviente." };
        }

    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        
        if (error.code === 'ER_DUP_ENTRY') {
            return { success: false, error: "El registro ya se encuentra en el sistema." };
        }
        
        return { success: false, error: error.message };
        
    } finally {
        if (conn && typeof conn.release === 'function') {
            conn.release();
        }
    }
}


ipcMain.handle('registro', async (event, datos) => {
    try {
        const resultado = await registro(datos); 
        return resultado; 
    } catch (error) {
        console.error("Error en el handler al guardar:", error);
        return { success: false, error: error.message };
    }
});



async function ConsultarSobreviviente(textoBusqueda) {
    let conn; 
    try {
      const  conn = await getConnection(); 
        const busquedaLimpia = textoBusqueda.trim();
        
        const sql = `SELECT * FROM sobrevivientes WHERE CAST(USER_ID AS CHAR) = ? OR NOMBRES LIKE ? LIMIT 1`;

        const valores = [busquedaLimpia, `%${busquedaLimpia}%` ];
        const [rows] = await conn.query(sql, valores);
        
        return rows; 
    } catch (error) {
        console.error("Error en SQL:", error);
        return []; 
    } finally {
        if (conn) conn.release(); 
    }
}


// Handler para Consultar Sobreviviente
ipcMain.handle('ConsultarSobreviviente', async (event, busqueda) => {
    try {
        console.log("=== Nueva Búsqueda Recibida ===");
        console.log("Criterio:", busqueda);
        const filasEncontradas = await ConsultarSobreviviente(busqueda); 
        console.log("Resultados encontrados en DB:", filasEncontradas); 
        
        return filasEncontradas; 
    } catch (error) {
        console.error("Error crítico en el Handler ConsultarSobreviviente:", error);
        return []; 
    }
});


//eliminar function


async function EliminarSobreviviente(id) {
    let conn;
    try {
       const conn = await getConnection();
       await conn.query('DELETE FROM caso WHERE USER_ID = ?', [id]);
        const sql = 'DELETE FROM sobrevivientes WHERE USER_ID = ?';
        const [result] = await conn.query(sql, [id]);
        
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error en la base de datos al eliminar:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}


// Handler para Eliminar Sobreviviente 
ipcMain.handle('EliminarSobreviviente', async (event, id) => {
    try {
        const resultado = await EliminarSobreviviente(id);
        if (resultado) {
            return { success: true };
        } else {    
            return { success: false, error: "No se encontró el registro para eliminar." };
        }
    } catch (error) {
        console.error("Error al eliminar:", error);
        return { success: false, error: error.message };
    }
});



// Función para buscar sobrevivientes por coincidencia de nombre
async function buscarSobrevivientePorNombre(nombre) {
    let conn;
    try {
        conn = await getConnection();
 
 
        const sql = `
            SELECT USER_ID, NOMBRES
            FROM sobrevivientes 
            WHERE NOMBRES LIKE ? 
            LIMIT 10`; 
        
        const [rows] = await conn.query(sql, [`%${nombre}%`]);
        return { success: true, resultados: rows };
    } catch (error) {
        console.error("Error al buscar por nombre:", error);
        return { success: false, error: error.message };
    } finally {
        if (conn) {
 
            if (typeof conn.release === 'function') conn.release();
            else if (typeof conn.end === 'function') conn.end();
        }
    }
}
//handler para buscar usuario por nombre en todas las paginas

ipcMain.handle('buscarPorNombre', async (event, nombre) => {
    try {
        const resultado = await buscarSobrevivientePorNombre(nombre);
        return resultado; 
    } catch (err) {
        console.error(err);
        return { success: false, error: err.message };
    }
});



//funcion para registrar caso
async function registrarCaso(registroC) {
    let conn;
    try {
        conn = await getConnection(); 

        const sqlValidar = "SELECT USER_ID  FROM sobrevivientes WHERE USER_ID = ?";
        const [usuarioExiste] = await conn.query(sqlValidar, [registroC.USER_ID]);

        if (usuarioExiste.length === 0) {
            // Si no hay resultados, devolvemos un error controlado
            return { 
                success: false, 
                error: `El ID de sobreviviente ${registroC.USER_ID} no existe en la base de datos.` 
            };
        }

        const sql = `INSERT INTO caso (
            NOMBRE_CASO, USER_ID, ESTADO_CASO, 
            REPATRIACION_AVION_SOLIDARIO, TIPO_ATENCION, TIPIFICACION, 
            ENTIDAD_REMITENTE, NIVEL_RIESGO, DENUNCIO, 
            DETALLES_DENUNCIA, RUTA_ACTIVA, RECIBIO_DINERO, 
            MEDIOS_RECIBIDO_DINERO, OFERTA_CAPTACION, AEROLINEA_USADA, 
            TRAYECTO_VUELO, FECHA_CREACION
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`;
        
        const valores = [
            registroC.NOMBRE_CASO,
            registroC.USER_ID,
            registroC.ESTADO_CASO,
            registroC.REPATRIACION_AVION, 
            registroC.TIPO_ATENCION,
            registroC.TIPIFICACION,
            registroC.ENTIDAD_REMITENTE,
            registroC.NIVEL_RIESGO,
            registroC.DENUNCIO,
            registroC.DETALLES_DENUNCIA,
            registroC.RUTA_ACTIVA,
            registroC.RECIBIO_DINERO,
            registroC.MEDIOS_RECIBIDO_DINERO,
            registroC.OFERTA_CAPTACION,
            registroC.AEROLINEA_USADA,
            registroC.TRAYECTO_VUELO
        ];
        
        const [result] = await conn.query(sql, valores);

        if (result.affectedRows > 0) {
            console.log("Registro exitoso.");
            return { success: true, id: result.insertId };
        } else {
            return { success: false, message: "No se pudo registrar." };
        }

    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return { success: false, error: error.message };
    } finally {
      
        if (conn) {
            if (typeof conn.release === 'function') {
                conn.release();
            } else if (typeof conn.end === 'function') {
                conn.end();
            }
        }
    }
}
    // handler registrarcaso

ipcMain.handle('registrarCaso', async (event, datos) => {
    try {
      
        const resultado = await registrarCaso(datos); 
        return { success: true, data: resultado };
    } catch (error) {
        console.error("Error al guardar:", error);
        return { success: false, error: error.message };
    }
});



//funcion consultar caso

async function ConsultarCaso(textoBusqueda) {
    let conn; 
    try {
      const  conn = await getConnection(); 
        const busquedaLimpia = textoBusqueda.trim();
        
        const sql = `SELECT * FROM caso
WHERE CAST(USER_ID AS CHAR) = ? 
   OR CAST(CASO_ID AS CHAR) LIKE ? 
   OR NOMBRE_CASO LIKE ? 
LIMIT 1;`;

        const valores = [busquedaLimpia, `%${busquedaLimpia}%`, `%${busquedaLimpia}%`];
        const [rows] = await conn.query(sql, valores);
        
        return rows; 
    } catch (error) {
        console.error("Error en SQL:", error);
        return []; 
    } finally {
        if (conn) conn.release(); 
    }
}
// Handler para Consultar caso
ipcMain.handle('ConsultarCaso', async (event, busqueda) => {
    try {
        console.log("=== Nueva Búsqueda Recibida ===");
        console.log("Criterio:", busqueda);
        const filasEncontradas = await ConsultarCaso(busqueda); 
        console.log("Resultados encontrados en DB:", filasEncontradas); 
        
        return filasEncontradas; 
    } catch (error) {
        console.error("Error crítico en el Handler ConsultarSobreviviente:", error);
        return []; 
    }
});

//eliminar function


async function EliminarCaso(casoId) {
    let conn;
    try {
        conn = await getConnection();
        
      
        await conn.query('DELETE FROM seguimiento WHERE CASO_ID = ?', [casoId]);

 
        const sql = 'DELETE FROM caso WHERE CASO_ID = ?';
        const [result] = await conn.query(sql, [casoId]);
    
        return result.affectedRows > 0;
    } catch (error) {
        console.error("Error al eliminar el caso:", error);
        throw error;
    } finally {
        if (conn) conn.release(); 
    }
}

// Handler para Eliminarcaso
ipcMain.handle('EliminarCaso', async (event, id) => {
    try {
        await funcionQueBorraEnMySQL(id);
        return { success: true }; 
    } catch (err) {
        return { success: false, error: err.message };
    }
});
//funcion registrar seguimiento
async function registrarSeguimiento(registroS) {
    let conn;
    try {
        conn = await getConnection(); 
        
        const sql = 'INSERT INTO seguimiento_micro (USER_ID, PROYECTO_ACTUAL, MOTIVACION_EXPECTATIVAS, HITO_1, HITO_2, HITO_3, HITO_4, HITO_5, HITO_6, HITO_7, HITO_8, HITO_9, HITO_10, FECHA_CORTE) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW());';
        
        const valores = [
            
            registroS.USER_ID,
            registroS.PROYECTO_ACTUAL,
            registroS.MOTIVACION_EXPECTATIVAS,
            registroS.HITO_1,
            registroS.HITO_2,
            registroS.HITO_3,
            registroS.HITO_4,
            registroS.HITO_5,
            registroS.HITO_6,
            registroS.HITO_7,
            registroS.HITO_8,
            registroS.HITO_9,
            registroS.HITO_10,

            
            ];
        
        const [result] = await conn.query(sql, valores);

        if (result.affectedRows > 0) {
            console.log("Registro exitoso.");
            return { success: true, id: result.insertId };
        } else {
            return { success: false, message: "No se pudo registrar." };
        }

    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return { success: false, error: error.message };
    } finally {
      
        if (conn) {
            if (typeof conn.release === 'function') {
                conn.release();
            } else if (typeof conn.end === 'function') {
                conn.end();
            }
        }
    }
}
    // handler registrar seguimiento

ipcMain.handle('registrarSeguimiento', async (event, datos) => {
    try {
      
        const resultado = await registrarSeguimiento(datos); 
        return { success: true, data: resultado };
    } catch (error) {
        console.error("Error al guardar:", error);
        return { success: false, error: error.message };
    }
});


 // funcion asincronica registrar seguimiento macro

async function registrarSeguimientoMacro(registroS) {
    let conn;
    try {
        conn = await getConnection(); 
        
        const sql = 'INSERT INTO seguimiento_macro ( SALUD_FISICA, SALUD_MENTAL,SEGURIDAD_PROTECCION, VIVIENDA, INGRESOS_MEDIOS_VIDA, EDUCACION_BASICA, REDES_APOYO, AUTONOMIA, NOTA_SUCESO, APOYO_EQUIPO, DIFICULTADES_EQUIPO, USER_ID, fecha_Seguimiento) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? , NOW());';
        
        const valores = [
            
            registroS.SALUD_FISICA,
            registroS.SALUD_MENTAL,
            registroS.SEGURIDAD_PROTECCION,
            registroS.VIVIENDA,
            registroS.INGRESOS_MEDIOS_VIDA,
            registroS.EDUCACION_BASICA,
            registroS.REDES_APOYO,
            registroS.AUTONOMIA,
            registroS.NOTA_SUCESO,
            registroS.APOYO_EQUIPO,
            registroS.DIFICULTADES_EQUIPO,
            registroS.USER_ID,
            registroS.fecha_Seguimiento,

            ];
        
        const [result] = await conn.query(sql, valores);

        if (result.affectedRows > 0) {
            console.log("Registro exitoso.");
            return { success: true, id: result.insertId };
        } else {
            return { success: false, message: "No se pudo registrar." };
        }

    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return { success: false, error: error.message };
    } finally {
      
        if (conn) {
            if (typeof conn.release === 'function') {
                conn.release();
            } else if (typeof conn.end === 'function') {
                conn.end();
            }
        }
    }
}
    // handler registrar seguimiento macro

ipcMain.handle('registrarSeguimientoMacro', async (event, datos) => {
    try {
      
        const resultado = await registrarSeguimientoMacro(datos); 
        return { success: true, data: resultado };
    } catch (error) {
        console.error("Error al guardar:", error);
        return { success: false, error: error.message };
    }
});










// Handler para el grafico
ipcMain.handle('get-stats', async (event, userId) => {
    return await obtenerEstadisticasProgreso(userId);
});





//objetos de registros micro

const textosHitos = {

    emprendimiento: [
        "Idea de emprendimiento definida", "Capacitación técnica inicial", "Capacitación en gestión básica",
        "Plan simple de negocios", "Acceso a insumos", "Inicio de actividades productivas",
        "Primera venta realizada", "Gestión básica de ingresos/gastos", "Sostenibilidad inicial", "Satisfacción con el proyecto"
    ],
    estudio: [
        "Interés educativo identificado", "Decisión vocacional acompañada", "Información de oferta educativa",
        "Inscripción realizada", "Acceso a materiales", "Asistencia regular",
        "Rendimiento satisfactorio", "Permanencia sin abandono", "Proyección de continuidad", "Satisfacción con el estudio"
    ],
    trabajo: [
        "Interés laboral identificado", "Revisión de habilidades", "Elaboración de CV",
        "Búsqueda activa", "Entrevistas realizadas", "Inserción laboral inicial",
        "Condiciones dignas", "Continuidad en el empleo", "Adaptación laboral", "Satisfacción en el trabajo"
    ],
    hogar: [
        "Decisión consciente rol ciudad", "Vivienda adecuada", "Acceso a servicios básicos",
        "Organización de rutinas", "Escolarización infantil", "Acceso a salud familiar",
        "Red de apoyo cuidado", "Autocuidado básico", "Bienestar emocional", "Satisfacción con el proyecto"
    ],
    bienestar: [
        "Reconocimiento necesidades", "Acceso a apoyo psicosocial", "Identificación de emociones",
        "Manejo de ansiedad/estrés", "Fortalecimiento autoestima", "Desarrollo autocuidado",
        "Límites personales", "Reducción de riesgos", "Proyecto de vida formulado", "Satisfacción en el proyecto"
    ]
};


//funcion para consultar seguimiento bajo grafico

async function consultarSeguimiento(userIdentifier) { 
    let conn;
    try {
        conn = await getConnection();
        
        
        //  Filtro
        const sql = `
            SELECT 
                DATE_FORMAT(FECHA_CORTE, '%Y-%m') as mes_anio, 
                AVG(porcentaje) as promedio 
            FROM seguimiento_micro
            WHERE USER_ID = ? 
            GROUP BY YEAR(FECHA_CORTE), MONTH(FECHA_CORTE)
            ORDER BY FECHA_CORTE ASC`;

        // Inyección 
        const [rows] = await conn.query(sql, [userIdentifier]);
        
        return rows;
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return [];
    } finally {
        if (conn) {
           
            if (conn.release) conn.release(); 
        }
    }
}
// Handler 
ipcMain.handle('obtenerTodosLosSeguimientos', async (event, busqueda) => {
    const resultados = await consultarSeguimiento(busqueda);
    return resultados;
});

//funcion para consulta micro por desglosado cada hito en progreso

async function obtenerEstadisticasHitos(userIdentifier) { 
    let conn;
    try {
        conn = await getConnection();
        
        const sql = `SELECT 
        PROYECTO_ACTUAL, 
        DATE_FORMAT(FECHA_CORTE, '%Y-%m') as mes_anio, 
        AVG(HITO_1) as h1,
        AVG(HITO_2) as h2,
        AVG(HITO_3) as h3,
        AVG(HITO_4) as h4,
        AVG(HITO_5) as h5,
        AVG(HITO_6) as h6,
        AVG(HITO_7) as h7,
        AVG(HITO_8) as h8,
        AVG(HITO_9) as h9,
        AVG(HITO_10) as h10
    FROM seguimiento_micro
    WHERE USER_ID = ? 
    GROUP BY YEAR(FECHA_CORTE), MONTH(FECHA_CORTE), PROYECTO_ACTUAL
    ORDER BY FECHA_CORTE ASC;`;

        const [rows] = await conn.query(sql, [userIdentifier]);
        return rows;
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return [];
    } finally {
        if (conn) {
            // Si usas Pool: release(), si usas Connection: end()
            if (conn.release) conn.release();
            else if (conn.end) await conn.end();
        }
    }
}


// Handler 

ipcMain.handle('obtenerEstadisticasHitos', async (event, busqueda) => {
   
    const resultados = await obtenerEstadisticasHitos(busqueda);
    return resultados;
});







function cerrarSesion() {
    sessionStorage.clear(); // Borra todo lo de la sesión actual
    window.location.href = 'login.html'; // Redirige al inicio
}

//SEGUIMIENTO MACRO GENERAL


async function consultarSeguimientoMacro(userIdentifier) { 
    let conn;
    try {
        conn = await getConnection();
        
        
        //  Filtro
        const sql = `
            SELECT 
                DATE_FORMAT(fecha_seguimiento, '%Y-%m') as mes_anio, 
                AVG(porcentaje) as promedio 
            FROM seguimiento_macro
            WHERE USER_ID = ? 
            GROUP BY YEAR(fecha_seguimiento), MONTH(fecha_seguimiento)
            ORDER BY fecha_seguimiento ASC`;

        // Inyección 
        const [rows] = await conn.query(sql, [userIdentifier]);
        
        return rows;
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return [];
    } finally {
        if (conn) {
           
            if (conn.release) conn.release(); 
        }
    }
}
// Handler 
ipcMain.handle('obtenerTodosLosSeguimientosMacro', async (event, busqueda) => {
    const resultados = await consultarSeguimientoMacro(busqueda);
    return resultados;
});


//SEGUIMIENTOS MACRO


async function obtenerEstadisticasMacro(idUsuario) { 
    let conn;
    try {
        conn = await getConnection();
        
        const sql = `SELECT 
            SALUD_FISICA, SALUD_MENTAL, SEGURIDAD_PROTECCION, VIVIENDA, 
            INGRESOS_MEDIOS_VIDA, EDUCACION_BASICA, REDES_APOYO, AUTONOMIA,
            DATE_FORMAT(fecha_Seguimiento, '%d/%m/%Y') as fecha_formateada
        FROM seguimiento_macro 
        WHERE USER_ID = ? 
        ORDER BY fecha_Seguimiento ASC;`;

        const [rows] = await conn.query(sql, [idUsuario]);
        return rows;
    } catch (error) {
        console.error("Error en la consulta SQL:", error);
        return [];
    } finally {
        if (conn) {
            if (conn.release) conn.release();
            else if (conn.end) await conn.end();
        }
    }
}

// Handler 
ipcMain.handle('obtenerEstadisticasMacro', async (event, busqueda) => {
    const idUsuario = busqueda.user_identifier;
    if (!idUsuario) return [];
    
   const resultados = await obtenerEstadisticasMacro(idUsuario);
    return resultados;
});


async function ConsultarSeguimientoEspecifico(datos) {
    let conn; 
    try {
        conn = await getConnection();        
 const { userId, inicio, fin } = datos;

        const sql = `
            SELECT * FROM seguimiento_macro 
            WHERE CAST(USER_ID AS CHAR) = ? 
            AND fecha_Seguimiento BETWEEN ? AND ? 
            ORDER BY fecha_Seguimiento ASC
        `;

 
        const valores = [userId.trim(), inicio, fin];
        
        const [rows] = await conn.query(sql, valores);
        return rows; 
    } catch (error) {
        console.error("Error en SQL:", error);
        return []; 
    } finally {
        if (conn) conn.release(); 
    }
}// Handler para Consultar seguimiento
ipcMain.handle('ConsultarSeguimientoEspecifico', async (event, datosBusqueda) => {
    try {
        console.log("=== Nueva Búsqueda por Rango Recibida ===");
        console.log("Usuario:", datosBusqueda.userId, "Rango:", datosBusqueda.inicio, "a", datosBusqueda.fin);
        
        const filasEncontradas = await ConsultarSeguimientoEspecifico(datosBusqueda); 
        
        console.log(`Resultados encontrados: ${filasEncontradas.length}`); 
        return filasEncontradas; 
    } catch (error) {
        console.error("Error crítico en el Handler:", error);
        return []; 
    }
});

//eliminar function


async function EliminarSeguimiento(seguimientoId) {
    let conn;
    try {
        conn = await getConnection(); 
        await conn.beginTransaction();

        // CORREGIDO: Filtramos estrictamente por la llave primaria del seguimiento, no por el usuario
        const sql = 'DELETE FROM seguimiento_macro WHERE ID_SEGUIMIENTO_MACRO = ?'; 
 

        const [result] = await conn.query(sql, [seguimientoId]);
        
        await conn.commit();
        return result.affectedRows > 0;
    } catch (error) {
        if (conn) await conn.rollback();
        console.error("Error en la base de datos al eliminar por ID de seguimiento:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}
// 2. Interceptor IPC (Llamada directa al modelo)
ipcMain.handle('EliminarSeguimiento', async (event, seguimientoId) => {
    try {
        const completado = await EliminarSeguimiento(seguimientoId);
        
        if (completado) {
            return { success: true, message: "Registro eliminado correctamente de la base de datos." };
        } else {
            return { success: false, message: "No se encontró ningún registro con ese ID para eliminar." };
        }
    } catch (err) {
        return { success: false, message: `Error interno al eliminar: ${err.message}` };
    }
});

async function funcionCerrarSesion(id) {
    let conn;
    try {
        conn = await getConnection();                                   
    } catch (error) {
        console.error("Error al conectar a la base de datos para eliminar:", error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}   

ipcMain.on('ir-a-cerrarSesion', (event) => {

    try{
    console.log("Cerrando sesión de usuario...");
    usuarioActual = null;
    mainWindow.loadFile('login.html');
    console.log("Sesión finalizada. Redirigido al Login."); 
    }catch (error) {
        console.error("Error al cerrar sesión:", error);
    }  
    
});


async function registrarNuevoUsuario(datos) {
    let conn;
    try {
        // Si por algún error de comunicación 'datos' llega vacío o nulo
        if (!datos.password || !datos.username || !datos.nombreCompleto || !datos.ciudad) {
            throw new Error("Datos de registro incompletos o invalidos");
        }

        conn = await getConnection();
        
        const sql = `INSERT INTO usuarios (USERNAME, PASSWORD, nombre_completo, ciudad_nacimiento, FECHA_CREACION) 
                     VALUES (?, ?, ?, ?, NOW())`;
        
        const valores = [
            datos.username.trim(), 
            datos.password, 
            datos.nombreCompleto.trim(),
            datos.ciudad.trim()
        ];

        await conn.query(sql, valores);
        return { success: true };

    } catch (error) {
        console.error("Fallo en registro:", error.message);
        return { success: false, error: error.message };
    } finally {
        if (conn) conn.release();
    }
}

// Handler para que el frontend pueda llamar a esta función
ipcMain.handle('registrar-usuario', async (event, datos) => {
    return await registrarNuevoUsuario(datos);
});



async function CambioClave(datos) {
    let conn;
    try {
        if (!datos.password || !datos.username || !datos.nombreCompleto || !datos.ciudad) {
            throw new Error("Datos de registro incompletos o invalidos");
        }

        conn = await getConnection();

        const queryCheck = 'SELECT * FROM usuarios WHERE USERNAME = ? and ciudad_nacimiento = ?';
        const [rows] = await conn.query(queryCheck, [datos.username.trim(), datos.ciudad.trim()]);

        if (rows.length === 0) {
            return { success: false, error: "No se encontró un usuario con ese nombre de usuario y ciudad de nacimiento." };
        }
        
        const sql = `UPDATE usuarios SET PASSWORD = ? WHERE USERNAME = ?`;
        
        const valores = [
               datos.password,
            datos.username.trim(), 
         
        ];

        await conn.query(sql, valores);
        return { success: true };

    } catch (error) {
        console.error("Fallo en registro:", error.message);
        return { success: false, error: error.message };
    } finally {
        if (conn) conn.release();
    }
}



ipcMain.handle('Actualizar-clave', async (event, datos) => {
    return await CambioClave(datos);
});







let window; 

function createWindow(){
    window = new BrowserWindow({
        width: 1100,
        height: 900,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
               preload: path.join(__dirname, 'preload.js'),
        }
    });
 
    window.loadFile('loginhtml.html');
}


app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') app.quit();
});



module.exports = {
    createWindow,
    login
   
};


