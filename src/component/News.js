import React, { useEffect, useState } from "react";
import NewsItem from "./NewsItem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";
const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(true);
  const [totalResults, setTotalResults] = useState(0);

  const capitalizeFirstLetter = (val) => {
    return String(val).charAt(0).toUpperCase() + String(val).slice(1);
  };
  const updateNews = async () => {
    props.setProgress(10);
    setLoading(true);
    const Url = `https://newsapi.org/v2/top-headlines?country=us&category=${props.category}&apiKey=07c328270bda4ab0a164307523f58dcd&page=${page}&pageSize=${props.pageSize}`;
    const response = await fetch(Url);
    props.setProgress(30);
    const data = await response.json();
    props.setProgress(70);
    setArticles(data.articles);
    setTotalResults(data.totalResults);
    setLoading(false);
    props.setProgress(100);
  };
  useEffect(() => {
    document.title = `${capitalizeFirstLetter(props.category)} - NewsMonkey`;
    updateNews();
  }, []);
  const handlePrevClick = () => {
    console.log("Previous");
    setPage(page - 1);
    updateNews();
  };
  const handleNextClick = async () => {
    setPage(page + 1);
    updateNews();
  };
  const fetchMoreData = async () => {
    setLoading(true);
    const Url = `https://newsapi.org/v2/top-headlines?country=us&category=${
      props.category
    }&apiKey=07c328270bda4ab0a164307523f58dcd&page=${page + 1}&pageSize=${
      props.pageSize
    }`;
    const nextPage = page + 1;
    const response = await fetch(Url);
    let data = await response.json();
    setArticles(articles.concat(data.articles));
    setTotalResults(data.totalResults);
    setPage(nextPage);
    setLoading(false);
  };
  return (
    <div className="container my-4">
      <h1
        className="text-center"
        style={{ margin: "35px 0px", marginTop: "90px" }}
      >
        NewsMonkey - Top {capitalizeFirstLetter(props.category)} Headlines{" "}
      </h1>
      {loading && page === 1 && <Spinner />}
      <InfiniteScroll
        dataLength={(articles || []).length}
        next={fetchMoreData}
        hasMore={(articles || []).length !== totalResults}
        loader={page > 1 && <Spinner />}
      >
        <div className="container">
          <div className="row">
            {articles &&
              articles.map((element) => {
                return (
                  <div className="col-md-4 mb-4" key={element.url}>
                    <NewsItem
                      title={element.title ? element.title.slice(0, 45) : ""}
                      description={
                        element.description
                          ? element.description.slice(0, 88)
                          : ""
                      }
                      imageUrl={element.urlToImage}
                      newsUrl={element.url}
                      author={element.author}
                      date={element.publishedAt}
                    />
                  </div>
                );
              })}
          </div>
        </div>
      </InfiniteScroll>
    </div>
  );
};
News.defaultProps = {
  pageSize: 8,
  category: "sport",
};
News.propTypes = {
  pageSize: PropTypes.number,
  category: PropTypes.string,
};

export default News;
