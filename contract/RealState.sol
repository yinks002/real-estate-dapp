// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT


contract RealEstate{
    //state variable
    struct Property{
       uint productID;
       address owner;
       uint price;
       string propertyTitle;
       string category;
       string images;
       string propertyAddress;
       string description;
       address[] reviewers;
       string[] reviews;
    }

    //mapping
    mapping(uint => Property) private properties;
    uint public propertyIndex;

    //events
    event PropertyListed(uint indexed id, address indexed owner, uint price
    );
    event PropertySold(uint indexed id, address indexed oldOwner, address
    indexed newOwner, uint price);
    event PropertyResold(uint indexed id, address indexed oldOwner,
    address indexed newOwner, uint price);

    //reviews
    struct Review{
        address reviewer;
        uint productId;
        uint rating;
        string comment;
        uint likes;
    }

    struct Product{
        uint productId;
        uint totalRating;
        uint numReviews;

    }
    mapping(uint => Review[]) private reviews;
    mapping (address => uint[]) private userReviews;
    mapping (uint => Product) private products;

    uint public reviewsCounter;
    event ReviewAdded(uint indexed productId, address indexed reviewer,
    uint rating, string comment);
    event ReviewLiked(uint indexed productId, uint indexed reviewIndex,
    address indexed liker, uint likes);




    //functions
    function listProperty(address owner, uint price, string memory _propertyTitle,
    string memory _category, string memory _images, string memory _propertyAddress,
    string memory _description) external returns (uint){
        require(price > 0, "Price must be greater than 0");
        uint productId = propertyIndex++;
        Property storage property = properties[productId];
        property.productID = productId;
        property.owner = owner;
        property.price =price;
        property.propertyTitle = _propertyTitle;
        property.images = _images;
        property.category = _category;
        property.propertyAddress= _propertyAddress;
        property.description = _description;

        emit PropertyListed(productId, owner, price);
        return productId;
    }

    function updateProperty(address owner, uint productId, string memory _propertyTitle, string memory _category, string memory _images, string memory _propertyAddress, string memory _description) external returns (uint){
        Property storage property = properties[productId];
        require(property.owner == owner, "You are not the ownner of this property");
        property.propertyTitle = _propertyTitle;
        property.category= _category;
        property.images = _images;
        property.propertyAddress = _propertyAddress;
        property.description = _description;

        return productId;

    }

    function updatePrice(address owner, uint price, uint productId) external returns (string memory){
        Property storage property = properties[productId];
        require(property.owner == owner, "you are not the owner");
        property.price = price;

        return "your property price is updated";
    }

    function buyProperty(uint id, address buyer) external payable{
        uint amount  = msg.value;
        require(buyer != msg.sender, "you cannot buy your own property");
        require(amount >= properties[id].price, "Not enough money");
        Property storage property = properties[id];
        (bool sent, ) = payable (property.owner).call{value: amount}("");
        if(sent){
            property.owner = buyer;
            emit PropertySold(id, property.owner, buyer, amount);

        }



    }

    function getAllProperties() public view returns (Property[] memory){
        uint itemCount = propertyIndex;
        uint currentIndex = 0;
        Property[] memory items= new Property[](itemCount);
        for(uint i= 0; i < itemCount; i++){
        uint currentId = i + 1;
         
         Property storage currentItem = properties[currentId];
         items[currentIndex]= currentItem;
         currentIndex +=1;
        }

        return items;


    }

    function getProperty(uint id) external view returns (uint, address,
    uint, string memory, string memory, 
    string memory, string memory, string memory){
     
     Property memory property = properties[id];
     return (
        property.productID,
        property.owner,
        property.price,
        property.propertyTitle,
        property.category,
        property.images,
        property.propertyAddress,
        property.description
     );

    }

    function getUserProperties (address user) external view returns(Property[] memory){
        uint totalItemCount = propertyIndex;
        uint itemCount = 0;
        uint currentIndex = 0;

        for (uint i= 0; i < totalItemCount; i++){
            if(properties[i+ 1].owner == user){
                itemCount +=1;
            }
        }

        Property[] memory item = new Property[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++){
            if(properties[i +  1].owner == user){
                uint currentId = i + 1;
                Property storage currentItem = properties[currentId];


                item[currentIndex] = currentItem;
                currentIndex +=1;
            }
            

        }
        return item;
    }

    //review
    function addReview(uint productId, uint rating, string calldata comment,
   address user ) external{
    require(rating >= 1 && rating <=5, "rating must be between 1 and 5");
    Property storage property = properties[productId];
    property.reviewers.push(user);
    property.reviews.push(comment);

    // revuiew section
    reviews[productId].push(Review(user, productId, rating, comment, 0));
    userReviews[user].push(productId);
    products[productId].totalRating += rating;
    products[productId].numReviews++;
    emit ReviewAdded(productId, user, rating, comment);
    reviewsCounter++;
   }

    function getProductReviews(uint productId) external view returns(Review[] memory) {
        return reviews[productId];
    }

    function getUserReviews(address user) external view returns (Review[] memory){
        uint totalReviews = userReviews[user].length;

        Review[] memory userProductReviews = new Review[](totalReviews);

        for(uint i = 0; i < userReviews[user].length; i++){
            uint productId = userReviews[user][i];
            Review[] memory productReviews = reviews[productId];

            for (uint j = 0; j < productReviews.length; j++){
                if(productReviews[j].reviewer == user){
                    userProductReviews[i]= productReviews[j];
                }
            }
        }
        return userProductReviews;
    }

    function likeReview(uint productId, uint reviewIndex, address user) external{
        Review storage review = reviews[productId][reviewIndex];
        review.likes++;
        emit ReviewLiked(productId, reviewIndex, user, review.likes);
    }

    function getHighestratedProduct() external view returns (uint){
        uint highestRating = 0;
        uint highestRatedProductId = 0;

        for (uint i = 0; i < reviewsCounter; i++){
            uint productId = i + 1;
            if(products[productId].numReviews > 0){
                uint avgRating = products[productId].totalRating/ products[productId].numReviews;
                if(avgRating > highestRating){
                    highestRating = avgRating;
                    highestRatedProductId= productId;
                }
            }
        }
        return highestRatedProductId;


    }


}