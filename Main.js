const prompt = require('prompt-sync')()
const Libro = require('./Libros');
const Prestamos = require('./Prestamos');
const Usuarios = require('./Usuarios');


/* Simulador de Biblioteca Virtual
 Descripción: Un sistema para gestionar libros, préstamos y devoluciones.
 ● Funcionalidades:
 ○ Registrar libros con detalles como título, autor y categoría.
 ○ Registrar usuarios que pueden pedir libros prestados.
 ○ Simular el préstamo de libros, incluyendo una verificación de disponibilidad.
 ○ Registrar devoluciones y aplicar penalizaciones si se pasan del plazo.
 */


const biblioteca = { libros: [], usuarios: [], prestamos: [] }

// Datos de usuarios
biblioteca.usuarios.push(
    new Usuarios(1, "Ana", "Pérez", []),
    new Usuarios(2, "Juan", "Gómez", []),
    new Usuarios(3, "Laura", "Martínez", [])
)

// Datos de Libros
biblioteca.libros.push(
    new Libro(1, "Cien Años de Soledad", "Gabriel García Márquez", "Novela"),
    new Libro(2, "El Principito", "Antoine de Saint-Exupéry", "Infantil"),
    new Libro(3, "Sapiens", "Yuval Noah Harari", "Historia")
)

let ciclo = true

// Menu de opciones
while (ciclo) {
    console.log("\n--- Menú de Opciones ---");
    console.log("1- Registrar usuario");
    console.log("2- Registrar libro");
    console.log("3- Pedir prestado un libro");
    console.log("4- Devolver un libro");
    console.log("5- Mostrar estado de la biblioteca");
    console.log("6- Salir\n");

    const accion = prompt("Seleccione una opción: ");

    switch (accion) {
        case "1":
            registrarUsuario()
            break
        case "2":
            registrarLibro()
            break
        case "3":
            pedirLibro()
            break
        case "4":
            devolverLibro()
            break
        case "5":
            mostrarEstado()
            break
        case "6":
            console.log("Saliendo...")
            ciclo = false
            break
        default:
            console.log("Opción no válida. Intente de nuevo.\n")
            break
    }
}

// Registrar un Usuario
function registrarUsuario() {
    const id = biblioteca.usuarios.length + 1
    const nombre = prompt("Ingrese el nombre del nuevo usuario: ")
    const apellido = prompt("Ingrese el apellido del nuevo usuario: ")
    const usuario = new Usuarios(id, nombre, apellido, [])
    biblioteca.usuarios.push(usuario)
    console.log("Usuario registrado:", nombre, apellido)
}

// Registrar un Libro
function registrarLibro() {
    const id = biblioteca.libros.length + 1
    const titulo = prompt("Ingrese el titulo del libro: ")
    const autor = prompt("Ingrese el autor del libro: ")
    const categoria = prompt("Ingrese la categoria a la que pertenece el libro: ")
    const libro = new Libro(id, titulo, autor, categoria)
    biblioteca.libros.push(libro)
    console.log("Libro registrado:", titulo, autor)
}

// Registrar el prestamos de un libro
function pedirLibro() {

    //Mostramos la lista de Usuarios
    console.log("Usuarios:");
    biblioteca.usuarios.forEach(usuario => usuario.mostrarLibrosPrestados())
    const idUsuario = parseInt(prompt("Ingrese el ID del usuario que solicita el prestamos: "))

    //Mostramos la lista de Libros
    console.log("\nLibros:");
    biblioteca.libros.forEach(libro => libro.detallesLibro());
    const idLibro = parseInt(prompt("Ingrese el ID del libro que desea pedir prestado: "))

    const usuario = biblioteca.usuarios.find(u => u.id === idUsuario) // Recorremos el array biblioteca.usuarios y buscamos el id que sea igual a idUsuario, u representa cada elemento del array mientras se recorre y si lo encuentra se asigna a usuario
    const libro = biblioteca.libros.find(l => l.id === idLibro) // Recorremos el array biblioteca.libros y buscamos el id que sea igual a idLibro, l representa cada elemento del array mientras se recorre y si lo encuentra se asigna a libro

    if (!usuario || !libro) {
        console.log("Usuario o libro no encontrado.")
        return
    }

    if (!libro.disponible) {
        console.log("El libro", libro.titulo, "no está disponible.")
        return
    }
    libro.cambiarDisponibilidad(false)
    const prestamo = new Prestamos(biblioteca.prestamos.length + 1, idLibro, idUsuario)
    biblioteca.prestamos.push(prestamo)
    usuario.agregarLibro(libro)
    console.log("Libro", libro.titulo, "prestado a", usuario.nombre, usuario.apellido);
}

function devolverLibro() {

    //Mostramos la lista de Usuarios
    console.log("Usuarios:");
    biblioteca.usuarios.forEach(usuario => usuario.mostrarLibrosPrestados())
    const idUsuario = parseInt(prompt("Ingrese el ID del usuario que devuelve el libro: "))
    const usuario = biblioteca.usuarios.find(u => u.id === idUsuario) // Recorremos el array biblioteca.usuarios y buscamos el id que sea igual a idUsuario, u representa cada elemento del array mientras se recorre y si lo encuentra se asigna a usuario

    //Mostramos la lista de Libros
    //console.log("\nLibros:");
    //biblioteca.libros.forEach(libro => libro.detallesLibro());
    console.log(usuario.mostrarLibrosPrestados());
    
    const idLibro = parseInt(prompt("Ingrese el ID del libro a devolver: "))

    const libro = biblioteca.libros.find(l => l.id === idLibro) // Recorremos el array biblioteca.libros y buscamos el id que sea igual a idLibro, l representa cada elemento del array mientras se recorre y si lo encuentra se asigna a libro
    const prestamo = biblioteca.prestamos.find(p => p.idLibro === idLibro && p.idUsuario === idUsuario && !p.fechaDevolucion) // Recorremos el array de biblioteca.prestamos y buscamos que coincidan el idLibro, idUsuario y que el libro no haya sido ya devuelto y lo asignamos a prestamo

    // Verificamos que obtenemos todos los datos, libro, usuario y el prestamo
    if (!usuario || !libro || !prestamo) {
        console.log("Datos incorrectos o prestamo no encontrado.")
        return
    }

    const diasPrestamo = parseInt(prompt("Cuantos dias han pasado desde la fecha del prestamo? "))

    //const fechaActual = new Date() // Traemos la fecha actual y la asignamos a una variable
    //const diasPrestamo = (fechaActual - new Date(prestamo.fechaPrestamo)) / (1000 * 60 * 60 * 24) // Calculamos la cantidad de dias del prestamo

    if (diasPrestamo > 14) {
        usuario.penalizaciones += 1
        prestamo.penalizado = true
        console.log("Devolucion tardia. Penalizacion aplicada a:", usuario.nombre);
    } else {
        console.log("Devolucion en tiempo de:", usuario.nombre);
    }

    libro.cambiarDisponibilidad(true)
    //prestamo.fechaDevolucion = fechaActual
    usuario.devolverLibro(idLibro)
    console.log("Libro", libro.titulo, "devuelto por:", usuario.nombre, usuario.apellido);
}

// Mostramos los detalles de todos los arrays
function mostrarEstado() {
    console.log("Usuarios:");
    biblioteca.usuarios.forEach(usuario => usuario.mostrarLibrosPrestados()) // Recorremos el array biblioteca.usuarios y llamamos al metodo que muestra los detalles de la clase Usuarios
    console.log("\nLibros:");
    biblioteca.libros.forEach(libro => libro.detallesLibro()) // Recorremos el array biblioteca.libros y llamamos al metodo que muestra los detalles de la clase Libros
    console.log("\nPréstamos:");
    biblioteca.prestamos.forEach(prestamo => prestamo.detallesPrestamo()) // Recorremos el array biblioteca.prestamos y llamamos al metodo que muestra los detalles de la clase Prestamos
    console.log("\nPenalizaciones:");
    biblioteca.usuarios.forEach(usuario => usuario.verificarPenalizaciones()) // Recorremos el array biblioteca.usuarios y llamamos al metodo que muestra las penalizaciones de cada usuario
    
}