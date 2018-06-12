const mongoose = require('mongoose')
const Store = mongoose.model('Store')
const multer= require('multer')
const multerOptions={
	storage: multer.memoryStorage(),
	fileFilter(req,file, next){
		const isPhoto=file.mimetype.startsWith('image/');
		if(isPhoto){
			next(null,true);
		} else{
			({message:"That filetype isn\'t allowed!"},false);
		}
	}
};
const jimp=require('jimp');
const uuid=require('uuid');
exports.homePage=(req,res)=>{
	console.log(req.name);
	res.render('index',{title:'Home'});
}
exports.addStore=(req,res)=>{
	res.render('editStore',{title: 'Add Store'});
}
exports.upload=multer(multerOptions).single('photo');
exports.resize=async(req,res,next)=>{
	if(!req.file){
		next();
		return
	}
	const extension=req.file.mimetype.split('/')[1];
	req.body.photo=`${uuid.v4()}.${extension}`;
	const photo=await jimp.read(req.file.buffer);
	await photo.resize(800,jimp.AUTO);
	await photo.write(`./public/uploads/${req.body.photo}`);
	next();
}
exports.createStore=async (req,res)=>{
		const store = await(new Store(req.body)).save();
		req.flash('success',`Successfully Created ${store.name}. Care to leave a review?`);
		res.redirect(`/store/${store.slug}`);
}
exports.getStores=async(req,res)=>{
	const stores=await Store.find();
	res.render('stores',{title:'Stores',stores});
}

exports.editStore=async(req,res)=>{
	const store=await Store.findById(req.params.id);
	res.render('editStore',{title:`Edit ${store.name}`,store});
}
exports.updateStore=async(req,res)=>{
	req.body.location.type="Point";
	const store=await Store.findByIdAndUpdate(req.params.id,req.body,{new:true,runvalidators:true}).exec();
	req.flash('success',`Successfully updated <strong>${store.name}</strong> <a href="/stores/${store.slug}">View store</a>`);
	res.redirect(`/stores/${store._id}/edit`);
}
exports.getStoreBySlug=async(req,res,next)=>{
	const store=await Store.findOne({slug:req.params.slug});
	if(!store)return next();
	res.render('store',{store, title:store.name});
	//const store=await Store.find();
	//res.render('store',{title:`Store ${store.name}`,store});
}
exports.getStoresByTag = async (req,res)=>{
	const tag = req.params.tag;
	const tagQuery = tag || { $exists: true};
	const tagsPromise = Store.getTagsList();
	const storesPromise = Store.find({tags: tagQuery});
	const [tags,stores] = await Promise.all([tagsPromise,storesPromise]);
	res.render('tags',{tags,title:'Tags',tag,stores});
};