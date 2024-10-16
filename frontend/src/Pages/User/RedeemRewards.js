import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Card, Col, Row, Modal, Button, notification } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import WasteRequestForm from './../Form/WasteRequestForm'
import Header1 from '../../components/Layout/Header1'; // Import Header1
import {} from './../../components/style/RecyclingPage.css';
import recyclingImage from './../../components/image/recycling-image.jpeg';
import { useAuth } from '../../context/auth';

const RedeemRewards = () => {
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [visible, setVisible] = useState(false);
    const [modalContent, setModalContent] = useState(null);
    const [auth, setAuth] = useAuth();
    const [userPoint,setPoint] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        if (auth && auth.user) {
            setEmail(auth.user.email);
        }
    }, [auth]);

    useEffect(() => {
        getUserDetails();
    }, [email]);

    const getUserDetails = async() =>{
        try {
            const userResponse = await axios.get(`/api/v1/auth/get-SingleUser/${email}`);
            // console.log(email);
            const user = userResponse.data?.user;
            setPoint(user?.points);
            console.log(user);
        } catch (error) {
            console.log(error);
        }
    };


    const getAllBulkCategories = async () => {
        try {
            const { data } = await axios.get('/api/v1/RewardRoutes/get-rewards');
            if (data?.success) {
                setCategories(data.bulkCategories);
                console.log(data);
                getAllBulkCategories();
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    useEffect(() => {
        getAllBulkCategories();
    }, []);

    const handleCategoryClick = async (category) => {
        // Check if user has enough points
        if (userPoint >= category.point) {

            const totalPoints = userPoint- category.point ;
            setPoint(totalPoints);
            console.log(totalPoints);
            await axios.put(`/api/v1/auth/update-points/${email}`, {
                points: totalPoints, // Sending the total calculated points to update
              });
            // Show success notification
            notification.success({
                message: 'Redemption Successful',
                description: `You received this item. It will be delivered within 10 days.`,
                duration: 3, // Duration the toast message stays visible (in seconds)
            });
    
            // Optionally, update the backend to deduct points or register the reward redemption here
    
        } else {
            // Show error notification
            notification.error({
                message: 'Not Enough Points',
                description: `You need at least ${category.point} points to redeem this reward.`,
                duration: 3,
            });
        }
    };
    

    // const handleCloseModal = () => {
    //     setIsModalVisible(false);
    //     setSelectedCategory(null);
    // };

    // // Function to handle modal visibility and content
    // const handleModal = (content) => {
    //     setVisible(true);
    //     setModalContent(content);
    // };

    return (
        <div >
            <Header1 /> {/* Include Header1 here */}
            <div style={{
                // padding: '30px',
                paddingLeft:'10px',
                paddingRight:'10px',
                // backgroundColor: '#F3F4F6',
                maxWidth: '100%',
                maxHeight: '1000px',
                margin: '0 auto',
            }}>
                <h2 className='h2Header' style={{color: '#1A4D2E'}}>
                    Earn Rewards! <br/>
                    and<br/>
                    Exclusive items from our<br/>
                    community partners
                </h2>
                <div style={{paddingLeft:'10px',textAlign: 'right'}}>
                 Your have {userPoint} points.
                </div>
                
                

                {/* <h1 style={{
                    textAlign: 'center',
                    paddingTop:20,
                    color: '#1A4D2E',
                    fontWeight: 600,
                    marginBottom: '40px',
                }}>Waste Categories</h1> */}

                <div style={{
                    backgroundColor: '#EDEDED',
                    padding: '30px',
                    // paddingLeft:'30px',
                    // paddingRight:'30px',
                    // paddingBottom:'30px',
                    borderRadius: '12px',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
                }}>
                    <Row gutter={[16, 24]} justify="center">
                        {categories.map((category) => (
                            <Col key={category._id} xs={24} sm={12} md={6}> {/* Adjusted for 4 items in a row */}
                                <Card
                                    hoverable
                                    onClick={() => handleCategoryClick(category)}
                                    style={{
                                        boxShadow: '0 8px 16px rgba(0, 0, 0, 0.2)',
                                        borderRadius: '10px',
                                        width: '100%', 
                                        height: '320px',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}
                                    cover={
                                        category.photo ? (
                                            <img
                                                src={`/api/v1/RewardRoutes/reward-photo/${category._id}?t=${new Date().getTime()}`}
                                                alt={category.name}
                                                style={{
                                                    width: '100%',
                                                    height: '140px', // Adjusted height for the image (half of card size)
                                                    objectFit: 'cover',
                                                    borderTopLeftRadius: '12px',
                                                    borderTopRightRadius: '12px',
                                                }}
                                            />
                                        ) : (
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'center',
                                                alignItems: 'center',
                                                height: '140px', 
                                                borderTopLeftRadius: '12px',
                                                borderTopRightRadius: '12px',
                                                backgroundColor: '#f0f0f0',
                                            }}>
                                                <PlusOutlined style={{ fontSize: '36px', color: '#aaa' }} />
                                            </div>
                                        )
                                    }
                                >
                                    <div style={{
                                        textAlign: 'left',
                                        paddingLeft:'10px',
                                        paddingRight:'10px',
                                        paddingBottom:'10px',
                                        flexGrow: 1,
                                        display: 'flex',
                                        flexDirection: 'column',
                                        justifyContent: 'space-between',
                                    }}>
                                        <h3 style={{
                                            color: '#1A4D2E',
                                            fontWeight: 500,
                                            marginBottom: '4px', // Reduced margin between the name and image
                                        }}>{category.name}</h3>
                                        <p style={{
                                            color: '#666',
                                            fontSize: '14px',
                                            minHeight: '40px', 
                                            overflow: 'hidden', 
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitBoxOrient: 'vertical',
                                            WebkitLineClamp: 2, 
                                        }}>{category.description}</p>
                                        <p style={{color: '#1A4D2E'}}>(Eran at least {category.point} points.)</p>
                                    </div>
                                </Card>

                            </Col>
                        ))}
                    </Row>


                    {/* <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginTop: '40px',
                    }}>
                        <Button
                            type="primary"
                            onClick={() => { handleModal(<WasteRequestForm />);}}
                            style={{
                                backgroundColor: '#1A4D2E',
                                color: '#fff',
                                border: 'none',
                                padding: '12px 28px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 600,
                                boxShadow: '0 5px 15px rgba(0, 0, 0, 0.15)',
                                cursor: 'pointer',
                                transition: 'background-color 0.3s ease',
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#57A773'} // Hover effect
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#1A4D2E'} // Reset color
                        >
                            To Request Form
                        </Button>
                    </div> */}
                </div>

                {/* <Modal
                    title={<h2 style={{ fontWeight: 600, color: '#1A4D2E' }}>{selectedCategory?.name}</h2>}
                    visible={isModalVisible}
                    onCancel={handleCloseModal}
                    footer={null}
                    width={700}
                    bodyStyle={{ maxHeight: '400px', overflowY: 'auto', whiteSpace: 'pre-wrap' }} // Ensures text wraps correctly
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1, marginRight: '20px' }}>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Description:</strong> {selectedCategory?.description}</p>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Additional Description:</strong> {selectedCategory?.additionalDescription}</p>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Instructions:</strong> {selectedCategory?.instructions}</p>
                            <p style={{ whiteSpace: 'pre-wrap' }}><strong>Benefits:</strong> {selectedCategory?.benefits}</p>
                        </div>
                        {selectedCategory?.photo && (
                            <img
                                src={`/api/v1/RewardRoutes/reward-photo/${selectedCategory._id}?t=${new Date().getTime()}`}
                                alt={selectedCategory.name}
                                style={{ width: '300px', borderRadius: '8px', marginTop: '20px' }} // Add margin for spacing
                            />
                        )}
                    </div>
                </Modal> */}
                {/* <Modal
                    onCancel={() => setVisible(false)}
                    footer={null}
                    visible={visible}>
                    {modalContent}
              </Modal>  */}

            </div>
        </div>
    );
};

export default RedeemRewards;
