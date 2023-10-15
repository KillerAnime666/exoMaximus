import { 
    saveTask, 
    getTasks, 
    onGetTask,
    deleteTask,
    getTask,
    updateTask
} from "./firebase.js"

const taskForm = document.getElementById('task-form')
const taskContainer = document.getElementById('task-container')

let editStatus = false;
let id = ''; 

const iconoEditar = '<svg class="bi bi-pencil-square" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456l-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/><path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/></svg>';
const iconoBorrar = '<svg class="bi bi-trash" width="1em" height="1em" viewBox="0 0 16 16" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5zm3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0V6z"/><path fill-rule="evenodd" d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1v1zM4.118 4L4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4H4.118zM2.5 3V2h11v1h-11z"/></svg>';

window.addEventListener('DOMContentLoaded', async() => {
    taskContainer.innerHTML = ``;
    onGetTask((querySnapshot) => {

        querySnapshot.forEach(doc => {
            const task = doc.data()
            var pu = parseFloat(task.precio_unitario);
            var cant = parseInt(task.cantidad);
            var tot = pu * cant;
            console.log(tot);
            taskContainer.innerHTML += `
                <td>${task.producto}</td>
                <td>${task.fecha_compra}</td>
                <td>${task.cantidad}</td>
                <td>${task.precio_unitario}</td>
                <td>${tot}</td>
                <td><button class='btn btn-secondary btn-edit' data-id="${doc.id}">${iconoEditar}</button>       
                <button class='btn btn-primary btn-delete' data-id="${doc.id}">${iconoBorrar}</button></td>   
            `
        })

        const btnsDelete = taskContainer.querySelectorAll('.btn-delete')

        btnsDelete.forEach(btn => {
            btn.addEventListener('click', ({target: {dataset}}) => {
                Swal.fire({
                    title: '¿Estás seguro de eliminar el producto?',
                    text: "Esta opcion no se puede revertir",
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonColor: '#d33',
                    cancelButtonColor: '#3085d6',
                    confirmButtonText: 'Borrar'
                }).then((result) => {
                    if(result.value){
                        {target: {dataset}}
                        deleteTask(dataset.id)
                        Swal.fire('Eliminado', 'El producto ha sido eliminado', 'Success')
                    }
                    taskContainer.innerHTML = ``;
                })
            })
        })

        const btnsEdit = taskContainer.querySelectorAll('.btn-edit')

        btnsEdit.forEach(btn => {
            btn.addEventListener('click', async(e) => {
                const doc = await getTask(e.target.dataset.id)

                const task = doc.data()

                taskForm['task-title'].value = task.producto
                taskForm['task-quantity'].value = task.cantidad
                taskForm['task-price'].value = task.precio_unitario
                taskForm['task-date'].value = task.fecha_compra

                editStatus = true
                id = doc.id;

                taskForm['btn-task-save'].innerText = 'Actualizar'
            })
        })

    })


})

taskForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const product = taskForm['task-title']
    const quantity = taskForm['task-quantity']
    const price = taskForm['task-price']
    const date = taskForm['task-date']

    if(!editStatus){
        saveTask(product.value, quantity.value, price.value, date.value);
        taskContainer.innerHTML = ``;
    }else{
        updateTask(id,{
            producto: product.value, 
            cantidad: quantity.value,
            precio_unitario: price.value,
            fecha_compra: date.value
        });

        editStatus = false;
        taskForm['btn-task-save'].innerText = 'Guardar'
        taskContainer.innerHTML = ``;
    }  

    taskForm.reset(); 
    
})