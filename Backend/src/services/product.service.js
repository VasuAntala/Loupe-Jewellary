const Category = require("../models/category.model");
const Product = require("../models/product.model");

async function createProduct(reqData) {
    const topLevelName = reqData.topLevelCategory || "diamond";
    const secondLevelName = reqData.secondLevelCategory || "other";
    const thirdLevelName = reqData.thirdLevelCategory || '';

    let topLevel = await Category.findOne({ name: topLevelName });
    if (!topLevel) {
        topLevel = new Category({ name: topLevelName, level: 1 });
        await topLevel.save();
    }

    let secondLevel = await Category.findOne({ name: secondLevelName, parentCategory: topLevel._id });
    if (!secondLevel) {
        secondLevel = new Category({ name: secondLevelName, parentCategory: topLevel._id, level: 2 });
        await secondLevel.save();
    }

    // thirdLevel (specific style) if provided
    let leafCategory = secondLevel;
    if (thirdLevelName) {
        let thirdLevel = await Category.findOne({ name: thirdLevelName, parentCategory: secondLevel._id });
        if (!thirdLevel) {
            thirdLevel = new Category({ name: thirdLevelName, parentCategory: secondLevel._id, level: 3 });
            await thirdLevel.save();
        }
        leafCategory = thirdLevel;
    }

    const priceVal = Number(reqData.price || reqData.minPrice || 0);
    const discountedPriceVal = Number(reqData.discountedPrice || reqData.minPrice || priceVal || 0);
    let discountPercentVal = 0;
    if (priceVal > 0 && priceVal > discountedPriceVal) {
        discountPercentVal = Math.floor(((priceVal - discountedPriceVal) / priceVal) * 100);
    }

    const titleVal = reqData.title || "Untitled Product";
    const descriptionVal = reqData.description || titleVal;
    const detailsVal = reqData.details || descriptionVal;
    const brandVal = reqData.brand || "Loupe Jeweler";
    const quantityVal = reqData.quantity !== undefined ? Number(reqData.quantity) : 1;

    const product = new Product({
        title: titleVal,
        description: descriptionVal,
        details: detailsVal,
        occasion: reqData.occasion || [],
        type: reqData.type || '',
        color: reqData.color || [],
        price: priceVal,
        discountedPrice: discountedPriceVal,
        discountPercent: discountPercentVal,
        minPrice: Number(reqData.minPrice || priceVal),
        maxPrice: Number(reqData.maxPrice || priceVal),
        sizes: reqData.sizes || [],
        imageUrls: reqData.imageUrls || [],
        brand: brandVal,
        quantity: quantityVal,
        category: leafCategory._id,
        // Store flat category strings for easy retrieval
        topLevelCategory: topLevelName,
        secondLevelCategory: secondLevelName,
        thirdLevelCategory: thirdLevelName,
        metalType: reqData.metalType,
        metalPurity: reqData.metalPurity,
        metalWeight: reqData.metalWeight,
        hallmarkCertification: reqData.hallmarkCertification,
        metalColor: reqData.metalColor,
        primaryStoneType: reqData.primaryStoneType,
        stoneShape: reqData.stoneShape,
        stoneWeight: reqData.stoneWeight,
        ringSize: reqData.ringSize,
        chainLength: reqData.chainLength,
        pendantSize: reqData.pendantSize,
        dimensions: reqData.dimensions,
        totalWeight: reqData.totalWeight,
        productCode: reqData.productCode,
        status: reqData.status || 'active',
        priceNote: reqData.priceNote,
        dimensionsList: reqData.dimensionsList || [],
        diamondDetails: reqData.diamondDetails || [],
        metalDetails: reqData.metalDetails || [],
        includesChain: reqData.includesChain || 'No',
        chainWeight: reqData.chainWeight,
        chakiWeight: reqData.chakiWeight,
        collectionName: reqData.collectionName,
        tags: reqData.tags || [],
        additionalSpecifications: reqData.additionalSpecifications || [],
        showDiamondDetails: reqData.showDiamondDetails || false,
        showMetalDetails: reqData.showMetalDetails || false,
        showWeightDetails: reqData.showWeightDetails || false,
    });

    const savedProduct = await product.save();
    return await Product.findById(savedProduct._id).populate("category");
}

async function deleteProduct(productId) {
    try {
        // const product = await findProductById(productId);

        await Product.findByIdAndDelete(productId);
        return "Product deleted successfully";
    } catch (error) {
        throw new Error(error.message);
    }
}

async function updateProduct(productId, reqData) {
    // Also update flat category strings if provided
    const updateData = { ...reqData };
    return await Product.findByIdAndUpdate(productId, updateData, { new: true });
}

async function findProductById(id) {
    try {
        const product = await Product.findById(id)
            .populate("category")
            // .populate({ path: "category", populate: { path: "parentCategory" } })
            .populate("reviews")
            .populate("ratings")
            .populate({ path: 'reviews', populate: { path: 'user' } })
            .exec();

        if (!product) {
            throw new Error("Product not found with id: " + id);
        }
        return product;
    } catch (error) {
        throw new Error(error.message);
    }
}


// Get all products from a specific category 

async function getAllProducts(reqQuery) {
    let {
        category, // product-name
        type, // jewellery-type (gold, diamond, ...)
        color,
        minPrice,
        maxPrice,
        minDiscount,
        maxDiscount,
        occasion,
        sort,
        collectionName,
        search,
        // stock,
        pageNumber,
        pageSize, // total products in 1 page
    } = reqQuery;

    pageSize = parseInt(pageSize) || 12;
    pageNumber = parseInt(pageNumber);

    let query = Product.find()
        .populate("category")
        .populate({ path: "category", populate: { path: "parentCategory" } })
    // populate the reference to Category model


    // -------------------- Filter by Category ---------------

    if (category !== 'jewellery') {
        const existCategories = await Category.find({ name: category });
        
        let allCategoryIds = existCategories.map(cat => cat._id);
        
        if (allCategoryIds.length > 0) {
            // Find children categories (e.g. specific styles under a sub-category)
            const childCategories = await Category.find({ parentCategory: { $in: allCategoryIds } });
            const childIds = childCategories.map(c => c._id);
            allCategoryIds = [...allCategoryIds, ...childIds];
            
            // Find grandchildren just in case
            if (childIds.length > 0) {
                const grandChildCategories = await Category.find({ parentCategory: { $in: childIds } });
                allCategoryIds = [...allCategoryIds, ...grandChildCategories.map(c => c._id)];
            }
        }

        query = query.and([{
            $or: [
                { category: { $in: allCategoryIds } },
                { topLevelCategory: category },
                { secondLevelCategory: category },
                { thirdLevelCategory: category }
            ]
        }]);
    }

    // -------------------- Filter by Type ---------------

    if (type && type !== '' && type !== 'undefined') {
        const typeSet = new Set(type.split(",").map(type => type.trim().toLowerCase()));

        const typeRegex = typeSet.size > 0 ? new RegExp([...typeSet].join("|"), "i") : null;

        query = query.where("type").regex(typeRegex);
    }

    // -------------------- Filter by Color ---------------

    if (color && color !== '' && color !== 'undefined') {
        const colorSet = new Set(color.split(",").map(color => color.trim().toLowerCase()));

        const colorRegex = colorSet.size > 0 ? new RegExp([...colorSet].join("|"), "i") : null;

        query = query.where("color").regex(colorRegex);
    }

    // -------------------- Filter by Occasion ---------------

    if (occasion && occasion !== '' && occasion !== 'undefined') {
        const occasionArr = Array.isArray(occasion) ? occasion : String(occasion).split(",");
        const occasionSet = new Set(occasionArr.map(occ => String(occ).trim().toLowerCase()));

        const occasionRegex = occasionSet.size > 0 ? new RegExp([...occasionSet].join("|"), "i") : null;

        query = query.where("occasion").regex(occasionRegex);
    }

    // -------------------- Filter by Collection / Tags ---------------

    if (collectionName && collectionName !== '' && collectionName !== 'undefined') {
        query = query.and([{
            $or: [
                { collectionName: collectionName },
                { tags: collectionName }
            ]
        }]);
    }

    // -------------------- Filter by Price ---------------    

    if (minPrice && maxPrice) {
        query = query.where('discountedPrice').gte(minPrice).lte(maxPrice)
    }

    if (minDiscount && maxDiscount) {
        query = query.where('discountPercent').gte(minDiscount).lte(maxDiscount)
    }

    if (search && search !== '' && search !== 'undefined') {
        const searchRegex = new RegExp(search, "i");
        query = query.where("title").regex(searchRegex);
    }

    // if (stock) {
    //     if (stock === 'in_stock') {
    //         query = query.where('quantity').gt(0);
    //     }
    //     else if (stock === 'out_of_stock') {
    //         query = query.where('quantity').eq(0);
    //     }
    // }

    if (sort) {
        const sortDirection = sort === 'low_to_high' ? 1 : -1;
        query = query.sort({ "discountedPrice": sortDirection });
    }

    // -------------------- Execute query ---------------

    const totalProducts = await Product.countDocuments(query);
    // console.log("total prods: "+ totalProducts);

    const skip = (pageNumber - 1) * pageSize;
    query = query.skip(skip).limit(pageSize);
    // console.log("Final query:", query._conditions);  // Log the final query conditions

    const products = await query.exec();

    const totalPages = Math.ceil(totalProducts / pageSize);

    return { content: products, currentPage: pageNumber, totalPages };
}

async function createMultipleProducts(products) {
    for (let product of products) {
        await createProduct(product);
    }
}

module.exports = {
    createProduct,
    deleteProduct,
    updateProduct,
    findProductById,
    getAllProducts,
    createMultipleProducts
}