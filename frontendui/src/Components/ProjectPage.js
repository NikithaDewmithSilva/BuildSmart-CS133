import React, { useState, useEffect } from "react";
import { supabase } from '../supabase';
import './ProjectPage.css';

const ProjectPage = () => {





    return(
        <div className="project-content-container">
            <div className="project-title">
                sample name
            </div>

            <div className="boq-button">
                <button >
                    Generate a BOQ 
                </button>
            </div>

            <div className="instruction">
                Find your uploaded CAD files and BOQ files here
            </div>
            

            <div className="stored-files">
                <table className="documents-table">
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
                </table>
            </div>
        </div>
    )

}

export default ProjectPage;