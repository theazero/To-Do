const apiURL = 'https://js1-todo-api.vercel.app/api/todos?apikey=ae17e6c9-bf66-4eb6-84c8-2085c3384401';
const deleteURL = 'https://js1-todo-api.vercel.app/api/todos';
const form = document.querySelector('#regForm');
const message = document.querySelector('.invalid-feedback'); // Rätt hämtning
const taskInput = document.querySelector('#taskInput');
const list_task = document.querySelector('#list-task');



// Add task to list
function addTaskToList(taskTitle, taskID, completed = false) {
    const listItem = document.createElement('li'); 
    listItem.textContent = taskTitle; 

    if (!taskID) {
        console.error(`${taskTitle}`);
        return;
    }

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${taskID}`; 
    checkbox.classList.add('checkbox'); 
    checkbox.checked = completed; 

    // Checkbox change
    checkbox.addEventListener('change', function () {
        const updateUrl = `${deleteURL}/${taskID}?apikey=ae17e6c9-bf66-4eb6-84c8-2085c3384401`;

        fetch(updateUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                completed: checkbox.checked, 
            }),
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(`Task ${taskID} updated:`, data);
        })
        .catch(error => {
            console.error(`Failed to update task ${taskID}:`, error);
        });
    });

    // Add checkbox to list
    listItem.appendChild(checkbox);

    // Deletebutton
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>'; // FontAwesome-papperskorg
    deleteBtn.classList.add('delete-btn'); // Lägg till en klass för styling

    // Remove task
    deleteBtn.addEventListener('click', function (event) {
        event.preventDefault();

        const deleteUrlWithID = `${deleteURL}/${taskID}?apikey=ae17e6c9-bf66-4eb6-84c8-2085c3384401`;

        fetch(deleteUrlWithID, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            console.log(data);
            listItem.remove();
        })
        .catch(error => {
            console.error(error);
        });
    });

    listItem.appendChild(deleteBtn);

    list_task.appendChild(listItem);
}

// Fetch API data
fetch(apiURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP-fel! status: ${response.status}`);
        }
        return response.json(); // Convert to JSON
    })
    .then(data => {
        console.log('API DATA', data); 
        data.forEach(todo => addTaskToList(todo.title, todo._id, todo.completed)); // Skicka rätt taskID och completed
    })
    .catch(error => {
        console.error('ERROR', error); 
    });

// Submit tasks 
form.addEventListener('submit', function (event) {
    event.preventDefault(); 

    if (!taskInput.value.trim()) {
        message.textContent = 'Please provide a task';
        message.style.color = 'red';
        message.style.display = 'block'; // Gör det synligt om det är dolt
        return;
    }

    // Skicka POST-förfrågan till API:et
    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: taskInput.value.trim(), // Skicka rätt nyckel (t.ex. 'title')
            completed: false, // Standardvärde (ändra om API:et kräver det)
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json(); // Konvertera till JSON
    })
    .then(data => {
        console.log('Task created:', data); // Kontrollera att _id returneras
        if (data._id) {
            addTaskToList(data.title, data._id, data.completed); // Skicka rätt taskID här
        } else {
            console.error('NO ID:', data);
        }
        taskInput.value = ''; // Töm inputfältet
        message.style.display = 'none'; // Dölj framgångsmeddelandet
    })
    .catch(error => {
        console.error('error:', error);
        message.textContent = 'FAILED';
        message.style.color = 'red';
        message.style.display = 'block'; // Visa felmeddelandet
    });
});




  //modal


// const openModal = () => {
//   if (modal === undefined)
//     return;
// };

// const closeModal = () => {
//   modal.style.display = 'none';
// };
// //du vill ju att modalen ska komma upp bara när man klickar på knappen X skriv modalen efter du skriver X
// modal.addEventListener('click')