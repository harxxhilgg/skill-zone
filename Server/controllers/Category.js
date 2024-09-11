import { Category } from "../models/Category.js";
import { respond } from "../utils/response.js";
function getRandomInt(max) {
    return Math.floor(Math.random() * max)
  }

import mongoose from "mongoose";

//create category function

export const createCategory = async (req,res) => {
    try {
        //fetch data
        const {name,description} = req.body;
        //validation
        if(!name) {
            return respond(res,"All fileds are required",400,false)
        }
        //create entry in db
        const categoryDetails = await Category.create({
            name:name,
            description:description,
        });
        console.log(categoryDetails)
        
        return respond(res,"categories created successfully",200,true)
    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went wrong while creating the category",500,false)
    }
}

//get all category function

export const showAllCategory = async (req,res) => {
    try {
        //fatching all categories with name and description
        const allCategories = await Category.find({})

        return respond(res,"All categories returned successfully",200,true,allCategories)

    }
    catch(error) {
        console.log(error)
        return respond(res,"Something went werong while getting all categories",500,false)
    }
}

export const categoryPageDetails = async (req,res) => {
    try{
        //get categoryId
        const {categoryId} = req.body;

        console.log("PRINTING CATEGORY ID: ", categoryId);
        //get courses for specified categoryId
        const selectedCategory = await Category.findById(categoryId).populate({
            path:"course",
            match: {status: "Published"},
            // populate: "ratingAndReviews",
        }).exec()

        //validation
        if(!selectedCategory) {
            return respond(res,"Category not found",404,false)
        }

        if (selectedCategory.course.length === 0 ) {
            return respond(res,"No Courses found for the selected category",404,false)
        }

        const categoriesExceptSelected = await Category.find({
            _id:{$ne: categoryId},
        })

        //get coursefor different category
        // let differentCategory = await Category.findOne(
        //    categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]._id
        // ).populate({
        //     path:"course",match: {status: "Published"},
        // }).exec()

        let differentCategory = await Category.findOne(
            categoriesExceptSelected[getRandomInt(categoriesExceptSelected.length)]
            // ._id
          )
            .populate({
              path: "course",
              match: { status: "Published" },
            })
            .exec()

        const allCategories = await Category.find().populate({
            path: "course",
            match:{status: "Published"},
            populate: {
                path:"instructor",
            },
        }).exec()

        const allCourses = allCategories.flatMap((category) => category.course)
        const mostSellingCourses = allCourses.sort((a,b) => b.sold - a.sold).slice(0,10)

        res.status(200).json({
            success: true,
            data: {
              selectedCategory,
              differentCategory,
              mostSellingCourses,
            },
          })
    }
    catch(error) {
        console.log(error)
        return respond(res,"Somethinng went wrong while showing category page details",500,false)
    }
}