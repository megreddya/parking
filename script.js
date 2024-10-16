let parkingSlots = new Array(20).fill({ booked: false, userId: null, userName: null, vehicle: null, time: null });
let selectedSlotIndex = null; // Track selected slot index

// Load previously booked slots from sessionStorage
function loadParkingSlots() {
    const savedSlots = sessionStorage.getItem('parkingSlots');
    if (savedSlots) {
        parkingSlots = JSON.parse(savedSlots);
    }
}

// Save parking slots to sessionStorage
function saveParkingSlots() {
    sessionStorage.setItem('parkingSlots', JSON.stringify(parkingSlots));
}

// Display available slots for booking (on entry page)
if (document.getElementById('available-slots')) {
    loadParkingSlots(); // Load parking slots

    const slotsContainer = document.getElementById('available-slots');
    parkingSlots.forEach((slot, index) => {
        let slotDiv = document.createElement('div');
        slotDiv.className = 'slot ' + (slot.booked ? 'booked' : '');
        slotDiv.innerText = slot.booked ? `Slot ${index + 1} (Booked)` : `Slot ${index + 1} (Available)`;
        
        // Add click event to select slot
        slotDiv.addEventListener('click', () => {
            if (!slot.booked) {
                if (selectedSlotIndex !== null) {
                    // Remove highlight from previously selected slot
                    const prevSelectedSlot = document.querySelector(`.slot:nth-child(${selectedSlotIndex + 1})`);
                    if (prevSelectedSlot) {
                        prevSelectedSlot.classList.remove('selected');
                    }
                }
                selectedSlotIndex = index; // Update selected slot index
                slotDiv.classList.add('selected'); // Highlight the selected slot
            }
        });
        
        slotsContainer.appendChild(slotDiv);
    });

    // Handle vehicle parking on form submission
    const entryForm = document.getElementById('entry-form');
    if (entryForm) {
        entryForm.addEventListener('submit', function (e) {
            e.preventDefault(); // Prevent the default form submission
            let userId = document.getElementById('user-id').value.trim(); // Store as string
            let name = document.getElementById('user-name').value.trim();
            let vehicleNumber = document.getElementById('vehicle-number').value.trim();

            // Check if the user ID is unique
            const existingUserIndex = parkingSlots.findIndex(slot => slot.userId === userId);
            if (existingUserIndex !== -1) {
                alert("User ID already exists. Please use a different User ID.");
                return;
            }

            // Check if a slot has been selected
            if (selectedSlotIndex !== null) {
                // Update the parking slot to booked
                let currentTime = new Date().toLocaleString();
                parkingSlots[selectedSlotIndex] = { 
                    booked: true, 
                    userId: userId,
                    userName: name, 
                    vehicle: vehicleNumber,
                    time: currentTime 
                };
                saveParkingSlots(); // Save updated slots to sessionStorage
                alert(`Slot ${selectedSlotIndex + 1} booked successfully!`);
                location.reload(); // Reload to refresh the slots display
            } else {
                alert("Please select an available slot before parking.");
            }
        });
    }
}

// Handle vehicle exit in exit.html
if (document.getElementById('booked-vehicles')) {
    loadParkingSlots(); // Load parking slots

    const bookedVehiclesContainer = document.getElementById('booked-vehicles');

    parkingSlots.forEach((slot, index) => {
        if (slot.booked) {
            let vehicleDiv = document.createElement('div');
            vehicleDiv.className = 'vehicle';

            // Create a single line for vehicle info
            let vehicleInfo = document.createElement('div');
            vehicleInfo.innerText = `Slot: ${index + 1} | User ID: ${slot.userId} | Vehicle Number: ${slot.vehicle}`;
            vehicleInfo.className = 'info'; // Add a class for styling

            // Append vehicleInfo to vehicleDiv
            vehicleDiv.appendChild(vehicleInfo);
            
            // Create delete button
            let deleteButton = document.createElement('button');
            deleteButton.innerText = 'Exit & Free Slot';
            deleteButton.addEventListener('click', () => {
                // Reset the slot to default values
                parkingSlots[index] = { booked: false, userId: null, userName: null, vehicle: null, time: null };
                saveParkingSlots(); // Save updated slots to sessionStorage
                alert(`Slot ${index + 1} has been freed!`);
                vehicleDiv.remove(); // Remove the freed vehicle from display
            });

            // Append delete button to vehicleDiv
            vehicleDiv.appendChild(deleteButton);
            bookedVehiclesContainer.appendChild(vehicleDiv);
        }
    });

    if (bookedVehiclesContainer.children.length === 0) {
        bookedVehiclesContainer.innerHTML = '<p>No vehicles currently parked.</p>';
    }
}



// Display the status of all parking slots (on status page)
if (document.getElementById('parking-slots')) {
    loadParkingSlots(); // Load parking slots

    const slotsContainer = document.getElementById('parking-slots');
    parkingSlots.forEach((slot, index) => {
        let slotDiv = document.createElement('div');
        slotDiv.className = 'slot ' + (slot.booked ? 'booked' : 'available');
        slotDiv.innerText = slot.booked ? `Slot ${index + 1} (Booked)` : `Slot ${index + 1} (Available)`;

        if (slot.booked) {
            // Create details button
            let detailsButton = document.createElement('button');
            detailsButton.className = 'details-button';
            detailsButton.innerText = 'View Details';
            detailsButton.onclick = () => {
                // Show details in an alert box
                alert(`User ID: ${slot.userId}\nUser: ${slot.userName}\nVehicle: ${slot.vehicle}\nParked At: ${slot.time}`);
            };
            slotDiv.appendChild(detailsButton);
        }
        
        slotsContainer.appendChild(slotDiv);
    });
}
