const form = document.getElementById("client-form");
const  clientList = document.getElementById("client-list");
const API_Url = "http://localhost:3000/clients";

//Function to fetch and display clients
function loadClients(){
    fetch(API_Url)
    .then (respond => {
        if(!respond.ok) throw new Error("Failed to fetch clients");
        return respond.json();
    })
    .then (data => {
        clientList.innerHTML = "";

        if (data.length === 0){
            clientList.innerHTML = "<li>No client registered yet</li>";
            return;
        }

        data.forEach(client => {
            const li = document.createElement("li");

            li.innerHTML =`
            <p id= "name"><strong>Name:<strong> ${client.name}</p>
            <p id= "contact"><strong>Contact:<strong> ${client.contact}</p>
            <p id= "email"><strong>Email:<strong> ${client.email}</p>
            <p id= "location"><strong>Location:<strong> ${client.location}</p>
            <pi><strong>Service(s):<strong> ${client.services.join(" , ")}</p>`;

            const deleteBtn = document.createElement("button");
            deleteBtn.textContent = "Delete";
            deleteBtn.addEventListener("click", () => {
                deleteClient(client.id, li)
            });

            li.appendChild(deleteBtn);
            clientList.appendChild(li);
        })
    })

    .catch(error => console.error("Error:",error));
}

//add a client after filling the form
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value ;
    const contact = document.getElementById("contact").value ;
    const email = document.getElementById("email").value ;
    const location = document.getElementById("location").value ;

    const services = Array.from // converts  Nodelist to an array
    (form.querySelectorAll("input[type= checkbox]:checked"))
// displays only the checked boxes and ignores the unchecked
.map(cb => cb.value);
//each cb is a checkbox and cb.value gets its value

    const newClient = {name, contact, email, location, services};
//POST instead of get because we're adding data
    fetch(API_Url,{
        method: "POST",
        headers:{"Content-Type":"application/json"},
//tells the server the type of data which is json data
        body: JSON.stringify(newClient)
//converts newClient to a string
    })
    .then (respond => {
        if(!respond.ok) throw new Error("Failed to add client");
        return respond.json();
    })
    .then(() => {
        form.reset();
        loadClients();
    })

    .catch(error => console.error("Error:",error));
});

//function for the deletebtn
function deleteClient(id,li){
    fetch(`${API_Url}/${id}`, { method: "DELETE"})
    .then (respond => {
        if(!respond.ok) throw new Error("Failed to delete client");
        li.remove();
        //removes a client from the json server
    })
    .catch (error => console.error("Error:",error));
}

loadClients();