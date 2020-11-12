<template>
	<div class="home">
		<div class="home-wrapper">
			<div>
				<button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 mr-2" @click="showAdd()">
					Add
				</button>
			</div>
			<div class="bg-white shadow overflow-hidden sm:rounded-md mt-3">
				<div v-if="todos.length === 0" class="pt-3 pb-2 text-center">
					No data available
				</div>
				<ul>
					<li v-for="(item, index) in todos" :key="index">
						<div class="block hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out">
							<div class="px-2 py-2 flex items-center sm:px-6">
								<div class="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
									<div>
										<div class="text-sm leading-5 font-medium text-indigo-600 truncate">
											{{ item.name }}
											<div class="ml-1 font-normal text-gray-500">
												{{ item.created_at }}
												<button type="button" class="inline-flex items-center mr-2 px-4 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150" @click="showUpdate(item)">
													Edit
												</button>
												<button type="button" class="inline-flex items-center  mr-2 px-4 py-1.5 border border-gray-300 text-xs leading-4 font-medium rounded text-gray-700 bg-white hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue active:text-gray-800 active:bg-gray-50 transition ease-in-out duration-150" @click="removeItem(item)">
													Remove
												</button>
											</div>
										</div>
									</div>
									<div class="mt-4 flex-shrink-0 sm:mt-0"></div>
								</div>
							</div>
						</div>
					</li>
				</ul>
			</div>
		</div>

		<!-- Modals -->
		<div class="fixed z-10 inset-0 overflow-y-auto" v-if="isShowAdd">
			<div class="fixed z-10 inset-0 overflow-y-auto">
				<div class="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
					<div class="fixed inset-0 transition-opacity">
					<div class="absolute inset-0 bg-gray-500 opacity-75"></div>
					</div>

					<!-- This element is to trick the browser into centering the modal contents. -->
					<span class="hidden sm:inline-block sm:align-middle sm:h-screen"></span>&#8203;
					<div class="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6" role="dialog" aria-modal="true" aria-labelledby="modal-headline">
					<div>
						<div class="mt-3 text-center sm:mt-5">
						<h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-headline">
							Add Todo
						</h3>
						<div class="mt-2">
							<div>
								<label for="name" class="block text-sm font-medium leading-5 text-gray-700">Name</label>
								<div class="mt-1 relative rounded-md shadow-sm">
									<input id="name" class="form-input block w-full sm:text-sm sm:leading-5" placeholder="To do" v-model="name">
								</div>
							</div>
						</div>
						</div>
					</div>
					<div class="mt-5 sm:mt-6 sm:grid sm:grid-cols-1 sm:gap-1 sm:grid-flow-row-dense">
						<span class="mt-3 flex rounded-md shadow-sm sm:mt-0 sm:col-start-1">
							<button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5 mr-2" @click="selected ? update() : create()" :class="{ 'is-loading': isAdding }">
								{{ selected ? 'Update' : 'Add' }}
							</button>
							<button type="button" class="inline-flex justify-center w-full rounded-md border border-gray-300 px-4 py-2 bg-white text-base leading-6 font-medium text-gray-700 shadow-sm hover:text-gray-500 focus:outline-none focus:border-blue-300 focus:shadow-outline-blue transition ease-in-out duration-150 sm:text-sm sm:leading-5" @click="closeAdd()" :class="{ 'is-loading': isAdding }">
								Cancel
							</button>
						</span>
					</div>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script>

import { getAxiosErrorMessage, duplicateVar } from '@/lib/helper';
import todoApi from '@/api/todo';

export default {
	name: 'Home',
	components: {},
	data() {
		return {
			isFetching: false,
			isAdding: false,
			isShowAdd: false,
			name: null,
			todos: [],
			selected: null,
		};
	},
	methods: {
		fetch() {
			this.isFetching = true;
			const params = {};
			const callback = (response) => {
				this.todos = response.data;
				this.isFetching = false;
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Todo'),
					text: message,
				});
				this.isFetching = false;
			};
			todoApi.getList(params, callback, errorCallback);
		},
		showAdd() {
			this.isShowAdd = true;
			this.selected = null;
		},
		closeAdd() {
			this.isShowAdd = false;
			this.selected = null;
		},
		create() {
			this.isAdding = true;
			const params = {
				name: this.name,
			};
			const callback = (response) => {
				this.insertItem(response.data);

				this.name = null;
				this.isAdding = false;
				this.closeAdd();
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Todo'),
					text: message,
				});
				this.isAdding = false;
			};
			todoApi.create(params, callback, errorCallback);
		},
		removeItem(item) {
			const ids = [item.id];
			const itemIds = JSON.stringify(ids);
			const callback = () => {
				const index = this.todos.findIndex(({ id }) => id === item.id);
				if (index !== -1) this.todos.splice(index, 1);
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Todo'),
					text: message,
				});
			};
			todoApi.delete(itemIds, callback, errorCallback);
		},
		showUpdate(item) {
			this.selected = duplicateVar(item);
			this.name = item.name;
			this.isShowAdd = true;
		},
		closeUpdate() {
			this.selected = null;
			this.isShowAdd = false;
		},
		update() {
			this.isAdding = true;
			const params = {
				name: this.name,
			};
			const callback = (response) => {
				this.insertItem(response.data);
				this.isAdding = false;
				this.closeUpdate();
			};
			const errorCallback = (e) => {
				const message = getAxiosErrorMessage(e);
				this.$notify({
					group: 'app',
					type: 'error',
					title: this.$t('Todo'),
					text: message,
				});
				this.isAdding = false;
			};
			todoApi.update(this.selected.id, params, callback, errorCallback);
		},
		insertItem(item) {
			const index = this.todos.findIndex(({ id }) => id === item.id);
			if (index === -1) {
				this.todos.push(item);
			} else {
				this.$set(this.todos, index, item);
			}
		},
	},
	computed: {
	},
	created() {
		this.fetch();
	},
};
</script>
