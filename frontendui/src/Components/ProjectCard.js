import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './ProjectCard.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../supabase';

const ProjectCard = ({ project, onDelete }) => {
  const navigate = useNavigate();

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const { project_id } = useParams();

  const handleViewProject = () => {
    navigate(`/project/${project.project_id}`);
  };

  const handleDeleteProject = (e) => {
    e.stopPropagation();
    setShowDeleteModal(true);
  };

  const confirmDeletion = async () => {
    try {
      setIsDeleting(true);

      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('project_id', project.project_id);

      if (error) throw error;

      onDelete(project.project_id);
      setShowDeleteModal(false);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Failed to delete the project. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className='project-card-container'>
      {/* Full background video */}
      <video autoPlay loop muted className='full-page-video'>
        <source src='/Projectcardv2.mp4' type='video/mp4' />
        Your browser does not support the video tag.
      </video>

      <div className='project-card'>
        {/* Project Card video */}
        <video autoPlay loop muted className='project-card-video'>
          <source src='/Projectcardv1.mp4' type='video/mp4' />
          Your browser does not support the video tag.
        </video>

        <div className='project-card-details'>
          <div className='project-name'>
            <h2>{project.project_name}</h2>
          </div>

          <div className='project-description'>
            {project.project_description || 'No description provided'}
          </div>

          <div className='project-footer'>
            <div className='project-date'>
              Created on: {new Date(project.created_at).toLocaleDateString()}
            </div>
            <div className='project-card-buttons'>
              <button className='view-project-button' onClick={handleViewProject}>
                Go to Project --&gt;
              </button>
              <button className='delete-project-button' onClick={handleDeleteProject}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Project Deleting Part */}
      {showDeleteModal && (
        <div className='delete-modal-background'>
          <div className='delete-modal'>
            <h3>Delete Project</h3>
            <div className='delete-modal-warning'>
              Are you sure you want to delete this project? This action cannot be undone.
            </div>

            <div className='delete-modal-buttons'>
              <button
                className='delete-modal-delete-button'
                onClick={confirmDeletion}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting' : 'Delete'}
              </button>
              <button
                className='delete-modal-cancel-button'
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectCard;