import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../Utils/axiosInstance";

export default function Menu() {
  const [themes, setThemes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchThemes = async () => {
      try {
        const response = await axiosInstance.get("/themes/");
        setThemes(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchThemes();
  }, []);

  if (loading) {
    return (
      <div>
        <h5>Loading...</h5>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 place-items-center min-h-screen">

        {themes.map(t => (
            <div key={t._id} className="card bg-base-100 w-full max-w-sm shadow-sm my-4">
              <Link to={`/home/${t._id}`}>
                <figure>
                  <img
                    src={t.images[0]}
                    alt={t.name}
                  />
                </figure>
                <div className="card-body">
                  <h2 className="card-title">
                    {t.name}
                    <div className="badge badge-secondary">NEW</div>
                  </h2>
                  <p>
                    {t.description}
                  </p>
                  <div className="card-actions justify-end">
                    <div className="badge badge-outline">{t.platform}</div>
                  </div>
                </div>
              </Link>
            </div>
        ))}
      </div>
    </>
  );
}
