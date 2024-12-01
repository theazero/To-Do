const apiURL = 'https://js1-todo-api.vercel.app/api/todos?apikey=ae17e6c9-bf66-4eb6-84c8-2085c3384401';
const deleteURL = 'https://js1-todo-api.vercel.app/api/todos';
const form = document.querySelector('#regForm');
const message = document.querySelector('.invalid-feedback'); 
const taskInput = document.querySelector('#taskInput');
const list_task = document.querySelector('#list-task');



// Function to add a task to the list
function addTaskToList(taskTitle, taskID, completed = false) {
    const listItem = document.createElement('li');
    listItem.textContent = taskTitle;

    if (!taskID) {
        console.error(`${taskTitle}`);
        return;
    }

    // Create a <span> for the text of the task
    const span = document.createElement('span');
    span.className = 'text';
    span.textContent = taskTitle;

    // Checkbox
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.id = `checkbox-${taskID}`;
    checkbox.classList.add('checkbox');
    checkbox.checked = completed;

    // Update task on checkbox change
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
        listItem.classList.toggle(checkbox.checked);
        listItem.classList.toggle('completed')
    })
    .catch(error => {
        console.error(`Failed to update task ${taskID}:`, error);
    });
});


    // Add checkbox to list
    listItem.appendChild(checkbox); 

    // Delete button
    const deleteBtn = document.createElement('button');
    deleteBtn.innerHTML = '<i class="fa-regular fa-trash-can"></i>';
    deleteBtn.classList.add('delete-btn');

    // Remove task with modal handling
    deleteBtn.addEventListener('click', function (event) {
        event.preventDefault();

        if (!checkbox.checked) {
            // If task is not completed, show modal
            showModal("Please mark the task as finished before deleting it from the list");
            return;
        }

        // Otherwise, send DELETE request
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

// Function to display the modal // Help from MDN Web Docs
function showModal(message) {
    const modal = document.getElementById('myModal');
    const modalMessage = document.getElementById('modal-message');
    const closeModal = document.getElementById('close-modal');

    if (!modal || !modalMessage || !closeModal) {
        console.error('Modal elements not found in the DOM.');
        return;
    }

    // Set the modal message
    modalMessage.textContent = message;

    // Show the modal
    modal.style.display = 'block';

    // Close the modal when the user clicks the close button
    closeModal.addEventListener('click', function () {
        modal.style.display = 'none';
    });

    // Close the modal when the user clicks outside of it
    window.addEventListener('click', function (event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });
}

// Fetch API data
fetch(apiURL)
    .then(response => {
        if (!response.ok) {
            throw new Error(`Fel med API:et, status: ${response.status}`);
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
        message.style.display = 'block'; 
        return;
    }

    // Post to API
    fetch(apiURL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            title: taskInput.value.trim(), 
            completed: false, 
        }),
    })
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP Error: ${response.status}`);
        }
        return response.json(); // Convert to JSON
    })
    .then(data => {
        console.log('Task created:', data); 
        if (data._id) {
            addTaskToList(data.title, data._id, data.completed); 
        } else {
            console.error('NO ID:', data);
        }
        taskInput.value = ''; 
        message.style.display = 'none'; 
    })
    .catch(error => {
        console.error('error:', error);
        message.textContent = 'FAILED';
        message.style.color = 'red';
        message.style.display = 'block';
    });
});