var express = require('express');
var router = express.Router();
var JunctionCategoriesModel = require('../models/junctioncategoriesmodel');
var JunctionDetailsModel = require('../models/junctiondetailsmodel');

router.get('/', function(req, res, next){
    console.log("Get Junction Categories");
    JunctionCategoriesModel.find({'status':'active'})
            .select('categoryid categoryName categoryDesc')
            .sort({categoryid:1})
            .exec(function(err, junctioncats){
                    // console.log("executed the home");
                    if(err) {
                        console.log("Error fetching junction categories : " + err);
                        throw err;
                    }
                    console.log("junction Categories: " + junctioncats);
                    res.status(200).json({ 
                        categories: junctioncats 
                    });

    });



	// res.json({user:req.isValidUser || null, title: 'BSERI',
	// 	categories: [
	// 			{categoryid:1,categoryName:"Quality", categoryDesc:"QualityQualityQualityQualityQualityQualityQualityQualityQualityQuality"},
	// 			{categoryid:2,categoryName:"InformationSecurity", categoryDesc:"InformationSecurityInformationSecurityInformationSecurityInformationSecurityInformationSecurityInformationSecurity"},
	// 			{categoryid:3,categoryName:"Environmental", categoryDesc:"EnvironmentalEnvironmentalEnvironmentalEnvironmentalEnvironmentalEnvironmentalEnvironmental"}
	// 		]});
});

router.get('/:catID', function(req, res, next){
    console.log(req.params.catID);

    //Get Category _id from JunctionCategoriesModel
    JunctionCategoriesModel
		.findOne({'categoryid':req.params.catID})
		.select('_id')
		.exec(function(err, junctioncat){
            // console.log("executed the home");
            if(err) {
                console.log("Error fetching junction categories ID : " + err);
                throw err;
            }
            console.log("junction Category: " + junctioncat);
            var catRefid = junctioncat._id;
            JunctionDetailsModel.find({'category':catRefid})
            		.select('title briefdesc detaildesc detailslink category')
                    .populate({path:'category', select: 'categoryName'})
            		.exec(function(err, junctiondetails){
			            if(err) {
			                console.log("Error fetching junction categories details : " + err);
			                throw err;
			            }
			            res.status(200).json({ 
			                blurbs: junctiondetails 
			            });

            		});
    });

    



	// res.json({
 // 			items: [
	// 			{itemid:1,title:"Quality1", briefdesc:"Quality1Quality1Quality1 Quality1Quality1 Quality1Quality1Quality1Quality1Quality1", detailslink:"#",detaildesc:"1Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean viverra odio eu arcu elementum gravida. Morbi vitae ultrices elit, a mattis lacus. Cras facilisis orci in nulla consectetur ultrices. Phasellus consequat felis ipsum, a feugiat tellus cursus sit amet. Fusce et venenatis est. Aenean pulvinar in erat ac efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus.Praesent nec ipsum tincidunt, fermentum erat ut, ultrices eros. Sed ac sapien et urna auctor lobortis ut ac tortor. Curabitur ut leo id metus sollicitudin finibus. Pellentesque velit libero, congue sed lobortis non, fermentum vitae dui. Nunc pharetra lorem feugiat accumsan mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque cursus lacus et varius molestie. Integer at vulputate purus. Donec tristique malesuada dapibus. Etiam felis quam, scelerisque ut enim sit amet, accumsan ullamcorper eros. Aenean risus diam, efficitur a mi et, mattis gravida magna. Aliquam nec consectetur magna.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam eu mi quis lectus posuere iaculis. Suspendisse sagittis volutpat nisi tempor imperdiet. In eu elit tellus. Curabitur id elit massa. Nulla rhoncus tempor nisl a pellentesque. Ut condimentum ipsum in nisi viverra, et dapibus augue pharetra. Nam pulvinar nunc d "},
	// 			{itemid:2,title:"Quality2", briefdesc:"Quality2Quality2Quality2 Quality2Quality2 Quality2Quality2Quality2Quality2Quality2", detailslink:"#",detaildesc:"2Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean viverra odio eu arcu elementum gravida. Morbi vitae ultrices elit, a mattis lacus. Cras facilisis orci in nulla consectetur ultrices. Phasellus consequat felis ipsum, a feugiat tellus cursus sit amet. Fusce et venenatis est. Aenean pulvinar in erat ac efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus.Praesent nec ipsum tincidunt, fermentum erat ut, ultrices eros. Sed ac sapien et urna auctor lobortis ut ac tortor. Curabitur ut leo id metus sollicitudin finibus. Pellentesque velit libero, congue sed lobortis non, fermentum vitae dui. Nunc pharetra lorem feugiat accumsan mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque cursus lacus et varius molestie. Integer at vulputate purus. Donec tristique malesuada dapibus. Etiam felis quam, scelerisque ut enim sit amet, accumsan ullamcorper eros. Aenean risus diam, efficitur a mi et, mattis gravida magna. Aliquam nec consectetur magna.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam eu mi quis lectus posuere iaculis. Suspendisse sagittis volutpat nisi tempor imperdiet. In eu elit tellus. Curabitur id elit massa. Nulla rhoncus tempor nisl a pellentesque. Ut condimentum ipsum in nisi viverra, et dapibus augue pharetra. Nam pulvinar nunc d "},
	// 			{itemid:3,title:"Quality3", briefdesc:"Quality3Quality3Quality3 Quality3Quality3 Quality3Quality3Quality3Quality3Quality3", detaildesc:"3Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean viverra odio eu arcu elementum gravida. Morbi vitae ultrices elit, a mattis lacus. Cras facilisis orci in nulla consectetur ultrices. Phasellus consequat felis ipsum, a feugiat tellus cursus sit amet. Fusce et venenatis est. Aenean pulvinar in erat ac efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus.Praesent nec ipsum tincidunt, fermentum erat ut, ultrices eros. Sed ac sapien et urna auctor lobortis ut ac tortor. Curabitur ut leo id metus sollicitudin finibus. Pellentesque velit libero, congue sed lobortis non, fermentum vitae dui. Nunc pharetra lorem feugiat accumsan mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque cursus lacus et varius molestie. Integer at vulputate purus. Donec tristique malesuada dapibus. Etiam felis quam, scelerisque ut enim sit amet, accumsan ullamcorper eros. Aenean risus diam, efficitur a mi et, mattis gravida magna. Aliquam nec consectetur magna.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam eu mi quis lectus posuere iaculis. Suspendisse sagittis volutpat nisi tempor imperdiet. In eu elit tellus. Curabitur id elit massa. Nulla rhoncus tempor nisl a pellentesque. Ut condimentum ipsum in nisi viverra, et dapibus augue pharetra. Nam pulvinar nunc d "},
	// 			{itemid:4,title:"Quality4", briefdesc:"Quality1Quality1Quality1 Quality1Quality1 Quality1Quality1Quality1Quality1Quality1", detailslink:"#",detaildesc:"4Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean viverra odio eu arcu elementum gravida. Morbi vitae ultrices elit, a mattis lacus. Cras facilisis orci in nulla consectetur ultrices. Phasellus consequat felis ipsum, a feugiat tellus cursus sit amet. Fusce et venenatis est. Aenean pulvinar in erat ac efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus.Praesent nec ipsum tincidunt, fermentum erat ut, ultrices eros. Sed ac sapien et urna auctor lobortis ut ac tortor. Curabitur ut leo id metus sollicitudin finibus. Pellentesque velit libero, congue sed lobortis non, fermentum vitae dui. Nunc pharetra lorem feugiat accumsan mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque cursus lacus et varius molestie. Integer at vulputate purus. Donec tristique malesuada dapibus. Etiam felis quam, scelerisque ut enim sit amet, accumsan ullamcorper eros. Aenean risus diam, efficitur a mi et, mattis gravida magna. Aliquam nec consectetur magna.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam eu mi quis lectus posuere iaculis. Suspendisse sagittis volutpat nisi tempor imperdiet. In eu elit tellus. Curabitur id elit massa. Nulla rhoncus tempor nisl a pellentesque. Ut condimentum ipsum in nisi viverra, et dapibus augue pharetra. Nam pulvinar nunc d "},
	// 			{itemid:5,title:"Quality5", briefdesc:"Quality2Quality2Quality2 Quality2Quality2 Quality2Quality2Quality2Quality2Quality2", detailslink:"#",detaildesc:"5Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean viverra odio eu arcu elementum gravida. Morbi vitae ultrices elit, a mattis lacus. Cras facilisis orci in nulla consectetur ultrices. Phasellus consequat felis ipsum, a feugiat tellus cursus sit amet. Fusce et venenatis est. Aenean pulvinar in erat ac efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus.Praesent nec ipsum tincidunt, fermentum erat ut, ultrices eros. Sed ac sapien et urna auctor lobortis ut ac tortor. Curabitur ut leo id metus sollicitudin finibus. Pellentesque velit libero, congue sed lobortis non, fermentum vitae dui. Nunc pharetra lorem feugiat accumsan mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque cursus lacus et varius molestie. Integer at vulputate purus. Donec tristique malesuada dapibus. Etiam felis quam, scelerisque ut enim sit amet, accumsan ullamcorper eros. Aenean risus diam, efficitur a mi et, mattis gravida magna. Aliquam nec consectetur magna.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam eu mi quis lectus posuere iaculis. Suspendisse sagittis volutpat nisi tempor imperdiet. In eu elit tellus. Curabitur id elit massa. Nulla rhoncus tempor nisl a pellentesque. Ut condimentum ipsum in nisi viverra, et dapibus augue pharetra. Nam pulvinar nunc d "},
	// 			{itemid:6,title:"Quality6", briefdesc:"Quality3Quality3Quality3 Quality3Quality3 Quality3Quality3Quality3Quality3Quality3", detailslink:"#",detaildesc:"6Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean viverra odio eu arcu elementum gravida. Morbi vitae ultrices elit, a mattis lacus. Cras facilisis orci in nulla consectetur ultrices. Phasellus consequat felis ipsum, a feugiat tellus cursus sit amet. Fusce et venenatis est. Aenean pulvinar in erat ac efficitur. Interdum et malesuada fames ac ante ipsum primis in faucibus.Praesent nec ipsum tincidunt, fermentum erat ut, ultrices eros. Sed ac sapien et urna auctor lobortis ut ac tortor. Curabitur ut leo id metus sollicitudin finibus. Pellentesque velit libero, congue sed lobortis non, fermentum vitae dui. Nunc pharetra lorem feugiat accumsan mattis. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Quisque cursus lacus et varius molestie. Integer at vulputate purus. Donec tristique malesuada dapibus. Etiam felis quam, scelerisque ut enim sit amet, accumsan ullamcorper eros. Aenean risus diam, efficitur a mi et, mattis gravida magna. Aliquam nec consectetur magna.Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam eu mi quis lectus posuere iaculis. Suspendisse sagittis volutpat nisi tempor imperdiet. In eu elit tellus. Curabitur id elit massa. Nulla rhoncus tempor nisl a pellentesque. Ut condimentum ipsum in nisi viverra, et dapibus augue pharetra. Nam pulvinar nunc d "}
	// 		]
	// 	});

});

module.exports = router;
