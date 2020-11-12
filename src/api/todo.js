import client from '../lib/http-client';
// import { buildQuery } from '../lib/helper';

const endpoint = '/todos';

export default {

	// Create
	create(params, cb, errorCb) {
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		const url = `${endpoint}`;
		client.post(url, params)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Get
	get(id, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		client.get(url)
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Get categories
	getList(params, cb, errorCb) {
		const responseHandler = (response) => {
			if (cb) cb(response.data);
		};
		const errorHandler = (e) => {
			if (errorCb) errorCb(e);
		};
		const url = endpoint;
		client.get(url, { params })
			.then(responseHandler)
			.catch(errorHandler);
	},

	// Update
	update(id, params, cb, errorCb) {
		const url = `${endpoint}/${id}`;
		client.put(url, params)
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},

	// Delete bulk categories
	delete(ids, cb, errorCb) {
		const url = `${endpoint}/delete`;
		const params = {
			ids,
		};
		client.delete(url, { params })
			.then((response) => {
				if (cb) cb(response.data);
			})
			.catch((e) => {
				if (errorCb) errorCb(e);
			});
	},
};
