import React, { useState, useEffect } from 'react';
import "./ProjectModal.css";
import { supabase } from "../supabase";
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const ProjectModal = ({ isOpen, closeModal}) => {

    const [projectName, setProjectName] = useState('');
    const [projectDescription, setProjectDescription] = useState('');
    const [userId, setUserId] = useState(null);
    const [message, setMessage] = useState('')

    const [formData, setFormData] = useState({
        projectName: "",
        projectDescription: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
          ...formData,
          [name]: value,
        });
    };


    useEffect(() => {
        const fetchUser = async () => {
          const { data: { session } } = await supabase.auth.getSession();
          
          if (session && session.user) {
            setUserId(session.user.id);
          }
        };
        
        fetchUser();
        
        // Set up subscription for auth changes
        const { data: authListener } = supabase.auth.onAuthStateChange(
          (event, session) => {
            if (session && session.user) {
              setUserId(session.user.id);
            } else {
              setUserId(null);
            }
          }
        );
        
        // Clean up subscription on unmount
        return () => {
          if (authListener && authListener.subscription) {
            authListener.subscription.unsubscribe();
          }
        };
      }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if(!formData.projectName){
            setMessage("Please fill out the project name");
            return;
        }
    
        try{
            const {data, error} = await supabase
            .from('projects') //name of the table where the data should be stored
            .insert([
                {
                    project_name: formData.projectName,
                    project_description: formData.projectDescription,
                    created_by: userId,
                },
            ])
    
            if (error) {
                throw error;
            }
    
            setMessage("Project creation successful!");
    
    
            //closes the modal automatically after the submission
            // setTimeout(() => {
            //     closeModal();
            // }, 3000);
    
        }
        catch(error){
            setMessage(error.message);
        }
    }


    if (!isOpen) return null; //prevents from rendering the modal if it is not open

    return(
        <div className='project-modal-background' onClick={closeModal}>
            <div className='project-modal-container' onClick={(e) => e.stopPropagation()}>
                <div className='modal-close-icon'>
                    <button onClick={closeModal} className='modal-close-button'>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className='project-modal-title'>
                    <h2>Let's create a new project</h2>
                    {message && <h3>{message}</h3>}
                </div>
        
                <div className='project-modal-form-container'>
                    <form onSubmit={handleSubmit} className='project-modal-form'>
                        <div className='project-creation-form-input'>
                            <label>
                                Project Name: 
                                <input
                                    type="text"
                                    id='projectName'
                                    name="projectName"
                                    value={formData.projectName}
                                    onChange={handleChange}
                                    required
                                />
                            </label>
                        </div>
                        <div className='project-creation-form-input'>
                            <label>
                                Project Description:
                                <textarea
                                    className="contact-textarea"
                                    id='projectDescription'
                                    name='projectDescription'
                                    value={formData.projectDescription}
                                    onChange={handleChange}
                                ></textarea>
                            </label>
                        </div>
                        
                        

                        {/* hidden input for user id */}
                        <input type='hidden' value={userId}/> 

                        <button
                            type='submit'
                            className='modal-submit-button home-btn'>
                            Create
                        </button>

                    </form>
                </div>
            </div>
        </div>
        
    );
};

export default ProjectModal;


