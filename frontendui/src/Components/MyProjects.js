import React, { useState, useEffect } from 'react';
import { supabase } from "../supabase";
import ProjectCard from './ProjectCard';
import "./MyProjects.css";

const MyProjects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const chunkProperties = (arr, size) => {
    const result = [];
    for (let i = 0; i < arr.length; i += size) {
        result.push(arr.slice(i, i + size));
    }
    return result;
};

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        setLoading(true);
        
        // Get the current session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setError("You must be logged in to view projects");
          setLoading(false);
          return;
        }
        
        // Get projects for the current user
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('created_by', session.user.id)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        setProjects(data || []);
        console.log(data);
        
      } catch (err) {
        console.error("Error fetching projects:", err);
        setError("Failed to load projects");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);

  if (loading) return <div className="projects-loading">Loading projects...</div>;
  if (error) return <div className="projects-error">{error}</div>;

  const rows = chunkProperties(projects, 2);
  
  return (
    <div className="projects-container">
      <h1 className="projects-title">Projects</h1>
      
      {projects.length === 0 ? (
        <div className="no-projects">
          <p>You haven't created any projects yet.</p>
        </div>
      ) : (
        // <div className="projects-grid">
        //   {projects.map(project => (
        //     <ProjectCard key={project.id} project={project} />
        //   ))}
        // </div>

        rows.map((rows, rowIndex) => (
          <div className="projects-row" key={rowIndex}>
              {rows.map((project) => (
                  <ProjectCard
                  key={project.id}
                  project={project}
                  >
                  </ProjectCard>
              ))}
          </div>
      ))
      )}
    </div>
  );
};

export default MyProjects;