import React, { useEffect, useState } from "react";
import axiosInstance from "../Utils/axiosInstance";
import { useNavigate, useParams } from "react-router-dom";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function Item() {

  const {id} = useParams();
  const [ theme, setTheme ] = useState("");
  const [ loading, setLoading] = useState(true);
  const [guide, setGuide] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTheme = async() => {
      try {
        const response = await axiosInstance.get(`/themes/${id}`);
        setTheme(response.data.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchTheme();
  }, [id])

  if(loading) {
    return <div><h5>Loading...</h5></div>
  }

  const home = () => {
    navigate("/home");
  }

  const generateGuide = async() => {
    try {
      const response = await axiosInstance.get(`/themes/${id}/generateGuide`);
      setGuide(response.data.data);
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <>
      <div className="w-screen h-screen">
        <div className="hero bg-base-200 min-h-screen">
          <div className="hero-content flex-col lg:flex-col">
            <button className="btn btn-ghost" onClick={home}>Back</button>
            <h1 className="text-5xl font-bold self-start">{theme.name}</h1>

            <div className="flex-col justify-center">
              <div className="carousel w-full">
                <div id="slide3" className="carousel-item relative w-full">
                  <img
                    src={theme.images[0]}
                    className="w-full"
                  />
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide2" className="btn btn-circle">
                      ❮
                    </a>
                    <a href="#slide4" className="btn btn-circle">
                      ❯
                    </a>
                  </div>
                </div>
                <div id="slide4" className="carousel-item relative w-full">
                  <img
                    src={theme.images[1]}
                    className="w-full"
                  />
                  <div className="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide3" className="btn btn-circle">
                      ❮
                    </a>
                    <a href="#slide1" className="btn btn-circle">
                      ❯
                    </a>
                  </div>
                </div>
              </div>
              <div>
                <p className="py-6">
                  {theme.description}
                </p>
                <button className="btn btn-border" onClick={generateGuide}>
                  Get Installation Guide
                </button>
                <div>
                  <div className="collapse bg-base-100 border border-base-300">
                    <input type="checkbox" />
                    <div className="collapse-title font-semibold">Here's your Guide ;) :</div>
                    <div className="collapse-content text-sm guide-markdown">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>
                          {guide}
                      </ReactMarkdown>
                    </div>
                  </div>
              </div>
            </div>

            </div>
          </div>
        </div>
      </div>
    </>
  );
}
