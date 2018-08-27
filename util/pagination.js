pagination = (options)=>{
	return new Promise ((resolve,reject) => {
		let page = 1;
		if (!isNaN(parseInt(options.page))) {
			page = parseInt(options.page);
		}
		if(page <= 0){
			page = 1;
		}
		//每页显示条数
		let limit = 5;
		// options.model.estimatedDocumentCount(options.query)
		options.model.countDocuments(options.query)
		.then((count)=>{
			let pages = Math.ceil(count / limit);
			if(page > pages){
				page = pages;
			}
			if (pages == 0) {
				page = 1;
			}

			let skip = (page - 1)*limit;

			let query = options.model.find(options.query,options.projection);
			if (options.populate) {
				for (var i = 0; i < options.populate.length; i++) {
					query = query.populate(options.populate[i]);
				}
			}
			query
			.sort(options.sort)
			.skip(skip)
			.limit(limit)
			.then((docs)=>{
				resolve({
					current:page*1,
					list:docs,
					pageSize:limit,
					total:count
				});			
			})
		})
	})
	
}


module.exports = pagination;