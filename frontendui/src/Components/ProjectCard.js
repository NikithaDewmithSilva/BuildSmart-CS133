import React from 'react';
import { useNavigate } from 'react-router-dom';
import './ProjectCard.css';

const ProjectCard = ({ project }) => {
  const navigate = useNavigate();
  
  const handleViewProject = () => {
    navigate(`/project/${project.id}`);
  };
  
  return (
    <div className='project-card'>
        <div className='project-card-details'>
            <div className='project-name'>
                <h2>{project.project_name}</h2>
            </div>

            <div className='project-description'>
                {project.project_description || "No description provided"}
            </div>

            <div className='project-footer'>
                <div className='project-date'>
                    Created on: {new Date(project.created_at).toLocaleDateString()}
                </div>
                <button className='view-project-button' onClick={handleViewProject}>
                    Go to Project --&gt;
                </button>
            </div>

        </div>
      
    </div>
  );
};

export default ProjectCard;