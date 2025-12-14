import React, { useEffect, useState } from "react";
import axiosInstance from "./utils/axios";

export default function FetchAPI() {
  //USE STATE
  const [posts, setPosts] = useState([]);
  const [isLoading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [postDetail, setPostDetail] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [seachResult, setSearchResult] = useState([]);
  const [searchInput, setSeachInput] = useState("");
  const [pageList, setPageList] = useState([]);
  const [showGoToTop, setShowGoToTop] = useState(false);

  //USE EFFECT
  useEffect(() => {
    const getPosts = async () => {
      try {
        const res = await axiosInstance.get(`/posts?limit=10`);
        // console.log(res.data.total);
        const totalPage = Math.ceil(res.data.total / 10);
        setPageList(Array.from({ length: totalPage }, (_, i) => i + 1));
        // console.log(pageList);
        setPosts(res.data.posts);
      } catch (err) {
        // console.log(err.message);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    getPosts();
  }, []);
  const handlePostDetail = async (id) => {
    setShowModal(true);
    const res = await axiosInstance.get(`/posts/${id}`);
    setPostDetail(res.data);
  };
  useEffect(() => {
    const handleScroll = () => {
      // console.log(window.scrollY);
      window.scrollY >= 300 ? setShowGoToTop(true) : setShowGoToTop(false);
    };
    window.addEventListener("scroll", handleScroll);
  }, []);

  //GO TO TOP
  const handleGoToTop = () => {
    window.scrollTo(0, 0);
  };
  //GO TO TOP

  //REMOVE MODAL
  const handleRemoveModal = () => {
    setShowModal(!showModal);
    setPostDetail("");
  };
  document.addEventListener("keyup", (e) => {
    if (e.key === `Escape`) {
      handleRemoveModal();
    }
  });
  //REMOVE MODAL

  //SEARCH
  const handleSearch = async (input) => {
    try {
      setSeachInput(input);
      const res = await axiosInstance.get(`/posts/search?q=${input}&limit=10`);
      setSearchResult(res.data.posts);
      console.log(res.data.posts);
    } catch {
      console.log("can't find");
    }
  };
  //debounce
  function debounce(func, delay) {
    let timeout;

    return function (...args) {
      clearTimeout(timeout);

      timeout = setTimeout(() => {
        func.apply(this, args);
      }, delay);
    };
  }
  //SEARCH

  //SORT
  const debouncedSearch = debounce(handleSearch, 500);
  const handleOldestSort = async () => {
    const res = await axiosInstance.get(`/posts?sortBy=id&order=desc&limit=10`);
    // console.log(res.data);
    setPosts(res.data.posts);
  };
  const handleNewestSort = async () => {
    const res = await axiosInstance.get(`/posts?sortBy=id&order=asc&limit=10`);
    // console.log(res.data);
    setPosts(res.data.posts);
  };
  //SORT

  //PAGE CHANGING
  const handlePageChanging = async (e) => {
    const res = await axiosInstance.get(
      `/posts?limit=10&skip=${(e.target.id - 1) * 10}`
    );
    setPosts(res.data.posts);
    // console.log(e.target.id);
  };
  //PAGE CHANGING

  return (
    <div>
      <h1 className="text-center font-bold text-3xl mt-5">Blogs</h1>
      {/* Header */}
      <div className="flex flex-col gap-3 items-start w-[80%] mx-auto mt-3">
        <input
          onChange={(e) => debouncedSearch(e.target.value)}
          placeholder="Search..."
          className="px-3 py-2 border border-gray-500 w-full rounded-[5px]"
        ></input>
        <button className="px-3 py-2 border border-gray-500 rounded-[5px] cursor-pointer hover:bg-yellow-500">
          Thêm mới
        </button>
        <div>
          <button
            onClick={handleNewestSort}
            className="px-3 py-2 border border-gray-500 rounded-[5px] cursor-pointer hover:bg-yellow-500"
          >
            Mới nhất
          </button>
          <button
            onClick={handleOldestSort}
            className="px-3 py-2 border border-gray-500 rounded-[5px] cursor-pointer ml-3 hover:bg-yellow-500"
          >
            Cũ nhất
          </button>
        </div>
        {/* End Header */}
        {/* PAGE CONTENT */}
        {isLoading ? (
          <h2 className="text-center font-bold text-3xl">Loading Posts...</h2>
        ) : error ? (
          <h2 className="text-center font-bold text-3xl">{error}</h2>
        ) : searchInput ? (
          seachResult.map((item) => (
            <div key={item.id} className="border p-3 rounded-[5px]">
              <h2 className="font-bold text-xl mb-3">{item.title}</h2>
              <p>{item.body}</p>
              <div className="flex justify-between mt-3 items-center">
                <button
                  onClick={() => handlePostDetail(item.id)}
                  className="py-1 px-4 border rounded-full hover:bg-yellow-500 cursor-pointer"
                >
                  Xem chi tiết
                </button>
                <div>
                  <button className="mr-3 text-green-500 cursor-pointer">
                    Sửa
                  </button>
                  <button className="text-red-500 cursor-pointer">Xóa</button>
                </div>
              </div>
            </div>
          ))
        ) : (
          posts.map((item) => (
            <div key={item.id} className="border p-3 rounded-[5px]">
              <h2 className="font-bold text-xl mb-3">{item.title}</h2>
              <p>{item.body}</p>
              <div className="flex justify-between mt-3 items-center">
                <button
                  onClick={() => handlePostDetail(item.id)}
                  className="py-1 px-4 border rounded-full hover:bg-yellow-500 cursor-pointer"
                >
                  Xem chi tiết
                </button>
                <div>
                  <button className="mr-3 text-green-500 cursor-pointer">
                    Sửa
                  </button>
                  <button className="text-red-500 cursor-pointer">Xóa</button>
                </div>
              </div>
            </div>
          ))
        )}
        {showModal && (
          <>
            <div className="w-[80%] border rounded-5px fixed top-50 p-3 bg-white rounded-[5px] z-100">
              {!postDetail ? (
                <h2>Loading Post Detail...</h2>
              ) : (
                <>
                  <h2 className="font-bold text-xl mb-3">{postDetail.title}</h2>
                  <hr className="text-gray-300" />
                  <p className="mt-3">{postDetail.body}</p>
                </>
              )}
            </div>
            <div
              onClick={handleRemoveModal}
              className="js-overlay fixed w-[100vw] h-[100vh] bg-gray-500 left-0 top-0 opacity-70"
            ></div>
          </>
        )}
        <div className="flex gap-3 flex-wrap mt-10 justify-center">
          {pageList.map((item) => (
            <button
              onClick={handlePageChanging}
              id={item}
              key={item}
              className="border w-10 h-10 rounded-full cursor-pointer hover:bg-yellow-500"
            >
              {item}
            </button>
          ))}
          {showGoToTop && (
            <button
              onClick={handleGoToTop}
              className="border rounded-full cursor-pointer fixed right-10 bottom-10 w-10 h-10 text-xl hover:bg-yellow-500"
            >
              ↑
            </button>
          )}
        </div>
        {/* END PAGE CONTENT */}
      </div>
    </div>
  );
}
