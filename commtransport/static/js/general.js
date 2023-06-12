// Materialize code for initialisation

document.addEventListener('DOMContentLoaded', function () {
	// Initialize side navigation
	const sidenavs = document.querySelectorAll('.sidenav');
	M.Sidenav.init(sidenavs, {edge: 'right'});

	// Initialize Collapsible lists
	const collapsibles = document.querySelectorAll('.collapsible');
	M.Collapsible.init(collapsibles);

	// Initialize Tooltips
	const tooltips = document.querySelectorAll('.tooltipped');
	M.Tooltip.init(tooltips);

	// Initialize Date Picker
	const datepicker = document.querySelector('.datepicker');

	let minDate = new Date();
	minDate.setDate(minDate.getDate() + 1);
	let maxDate = new Date();
	maxDate.setDate(maxDate.getDate() + 90);

	M.Datepicker.init(datepicker, {
		format: 'dd mmmm, yyyy',
		yearRange: 3,
		showClearBtn: true,
		minDate: minDate,
		maxDate: maxDate,
		yearRange: 1,
		i18n: {
			done: 'Select',
		},
	});

	// Initialize Time Picker
	const timepickers = document.querySelectorAll('.timepicker');
	M.Timepicker.init(timepickers, {
		defaultTime: '9:00 AM',
	});

});

// General Scripts

// Add event listener to the red car icon to allow signout
const redCarIcon = document.getElementById('red-car-icon');
redCarIcon?.addEventListener('click', () => {
	const signoutModal = document.getElementById('signout-modal');
	console.log(signoutModal)
	signoutModal.style.display = "flex"

	const signoutCancel = document.getElementById('signout-cancel');
	signoutCancel.addEventListener(
		'click',
		() => (signoutModal.style.display = 'none')
	);
})

// Add event listener to delete-button icons if they exist
const deleteButtons = document.querySelectorAll('.delete-button');
console.log(deleteButtons)
if (deleteButtons) {
	for (deleteBtn of deleteButtons) {
		const modalId = deleteBtn.dataset.modalId;
		const confirmDeleteModal = document.getElementById(modalId);
		const cancelId = deleteBtn.dataset.cancelId;
		console.log('cancel id:', cancelId);
		const cancelBtn = document.getElementById(cancelId);
		console.log(cancelBtn);

		const handleDelete = () => {
			
			confirmDeleteModal.style.display = 'flex';

			const handleCancel = () => {
				confirmDeleteModal.style.display = 'none';

				return cancelBtn.removeEventListener('click', handleCancel);
			}

			cancelBtn.addEventListener('click', handleCancel);

			return deleteBtn.removeEventListener('click', handleDelete)
		}
		
		deleteBtn.addEventListener('click', handleDelete);

		
	}
}
