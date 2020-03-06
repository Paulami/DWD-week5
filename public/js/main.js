// define your todos as a class
class Todos {
    constructor() {
        this.baseurl = 'api/v1/todos';
        this.todos = [];
        this.$todos = document.getElementById('todo-items');
        this.$form = document.getElementById('todo-form');
    }

    //initialize
    async init(){
        //update todo
        await this.updateTodos();
        this.$form.addEventListener('submit', async evt => {
            evt.preventDefault();
            await this.createTodo();
        });
    }

    //GET todos
    async getTodos(){
        //get data from our API
        let data = await fetch(this.baseurl);
        //turn it into a json
        data = await data.json();
        //fill todo array with that data
        this.todos = data;
        //render the data
        await this.renderTodos();
    }

    //POST todos
    async createTodo() {
        try {
            const newData = {
                //set the form input to the "todo" value
                todo: this.$form.todo.value;
                //set the status to incomplete
                status: 'incomplete'
            };
            const options = {
                method: 'POST',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData);
            };
            //get the data from the api
            let data = await fetch(this.baseurl, options);
            //format it as a json
            data = await data.json();
            //update the todo list with the new todo
            await this.updateTodos();
            //print an error if something goes wrong
        } catch (error) {
            console.error(error);
        }
    }

    // update todo (only for the status button)
    async updateTodo(id, newData) {
        try {
            const options = {
                method: 'PUT',
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newData)
            };
            //get your data
            let data = await fetch(`${this.baseurl}/${id}`, options);
            //set as json
            data = await data.json();
            //update the list of todos
            await this.updateTodos();
        } catch (error) {
            console.error(error);
        }
    }
}


//listen for when the DOM is loaded
window.addEventListener("DOMContentLoaded", async() => {
    //look up the list where our to-dos goes
    const todoItems = document.getElementById("todo-items");
    // fetch the todo items from our database
    // fetch("/api/v1/todos").then(res => res.json()).then((data) => {
    //     //add each todo to the list
    //     console.log(data)
    //     todoItems.innerHTML = listTodos(data);
    // })

    //get our result
   // let data = await fetch("/api/v1/todos");
    //turn result into a json
    data = await data.json();
    //call todo items function
    todoItems.innerHTML = listTodos(data);
    handleDelete();


})

function listTodos(data) {
    const myListElements =[]
    for(let i =0; i <data.length; i++ ){
        let item = data[i];
        let status;
        if(item.status == "not started"){
            status = "a";
        } else if( item.status == "in progress"){
            status = "b";
        } else if (item.status == "complete"){
            status = "c";
        } else {
            status = "d";
        }
        myListElements.push(`<li data-todo="${item.todo}">
                                <span class="status__${status}"> (${status}) </span>
                                <span>${item.todo}</span>
                                <button class="todo__delete"> delete it </button>
                            </li>`);
        
        
    }
    return myListElements.join("");
    
    //console.log(HELP);
}

// deleteButtons =  [];
function handleDelete() {
const deleteButtons =  document.querySelectorAll(".todo__delete");
console.log(deleteButtons);


deleteButtons.forEach( item => {
   
    item.addEventListener("click", async(evt) => {
        console.log("trying to delete");
        try{
            const id = evt.target._id;
            await fetch (`/api/v1/todos/${id}`, {method: "DELETE"});
            console.log("delete successful");
        } catch(error){
            console.log("OH NO! Somethign is wrong");
        }
    }
    )
    
});
}