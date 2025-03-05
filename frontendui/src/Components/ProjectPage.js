import React, { useState, useEffect } from "react";
import { supabase } from '../supabase';
import { useParams, useNavigate } from 'react-router-dom';
import './ProjectPage.css';

const ProjectPage = () => {
    const { id } = useParams(); //Access the project Id from the URL
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const navigate = useNavigate();

    useEffect(() => {
        const fetchProject = async () => {
            try{
                const { data, error} = await supabase
                .from('projects')
                .select('*')
                .eq('project_id', id)
                .single()

                if(error){
                    setError(error.message);
                }
                else{
                    setProject(data);
                }
            }
            catch(error){
                setError(error.message);
            }
            finally{
                setLoading(false);
            }
            
                
        }

        fetchProject();
         
    }, [id]);

    const handleGenerateBoq = () => {
        navigate('./input');
    }

    if(loading) return <div className="loading">Loading...</div>
    if(error) return <div className="error">{error.message}</div>




    return(
        
        <div className="project-content-container">
            <div className="project-title">
                {project.project_name}
            </div>

            <div className="boq-button">
                <button onClick={handleGenerateBoq}>
                    Generate a BOQ 
                </button>
            </div>

            <div className="instruction">
                Find your uploaded CAD files and generated BOQ files here
            </div>
            

            <div className="stored-files">
                <table className="documents-table">
                    <thead>
                        <tr>
                            <th>
                                CAD Files
                            </th>
                            <th>
                                Genearated BOQs
                            </th>
                        </tr>
                        <tr>
                            <td>
                                This an uploaded cad
                            </td>
                            <td>
                                This is a genearated BOQ
                            </td>
                        </tr>
                        <tr>
                            <td>
                                This an uploaded cad
                            </td>
                            <td>
                                This is a genearated BOQ
                            </td>
                        </tr>
                        <tr>
                            <td>
                                This an uploaded cad
                            </td>
                            <td>
                                This is a genearated BOQ
                            </td>
                        </tr>
                        <tr>
                            <td>
                                This an uploaded cad
                            </td>
                            <td>
                                This is a genearated BOQ
                            </td>
                        </tr>
                    </thead>
                    
                </table>
            </div>
        </div>
    )

}

export default ProjectPage;