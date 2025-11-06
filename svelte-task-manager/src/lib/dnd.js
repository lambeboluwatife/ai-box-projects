export const draggable = (node, data) => {
	let state = data;
	node.setAttribute('draggable', true);
	node.style.cursor = 'grab';

	function handleDragStart(event) {
		event.dataTransfer.setData('application/json', JSON.stringify(state.data));
		event.dataTransfer.effectAllowed = 'move';
	}

	node.addEventListener('dragstart', handleDragStart);

	return {
		update(newData) {
			state = newData;
		},

		destroy() {
			node.removeEventListener('dragstart', handleDragStart);
		}
	};
};

export const droppable = (node, callbacks) => {
	let state = {
		dropEffect: 'move',
		drag0verClass: 'droppable',
		...callbacks
	};

	function handleDragEnter(event) {
		event.target.classList.add(state.drag0verClass);
	}

	function handleDragLeave(event) {
		event.target.classList.remove(state.drag0verClass);
	}

	function handleDragOver(event) {
		event.preventDefault();
		event.dataTransfer.dropEffect = state.dropEffect;
	}

	function handleDrop(event) {
		event.preventDefault();
		event.target.classList.remove(state.drag0verClass);
		const data = JSON.parse(event.dataTransfer.getData('application/json'));
		state.onDrop(data);
	}

	node.addEventListener('dragenter', handleDragEnter);
	node.addEventListener('dragleave', handleDragLeave);
	node.addEventListener('dragover', handleDragOver);
	node.addEventListener('drop', handleDrop);

	return {
		update(callbacks) {
			state = {
				dropEffect: 'move',
				drag0verClass: 'droppable',
				...callbacks
			};
		},

		destroy() {
			node.removeEventListener('dragenter', handleDragEnter);
			node.removeEventListener('dragleave', handleDragLeave);
			node.removeEventListener('dragover', handleDragOver);
			node.removeEventListener('drop', handleDrop);
		}
	};
};
