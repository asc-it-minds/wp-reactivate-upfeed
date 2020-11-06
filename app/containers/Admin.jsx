import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
// TODO: change relative import
import { scoringText } from "../utils/utils";

export default function Admin() {
  const [blogId, setBlogId] = useState("");
  const [postId, setPostId] = useState("0");
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [dateCreated, setDateCreated] = useState("");
  const [words, setWords] = useState(0);
  const [headings, setHeadings] = useState(0);
  const [paragraphs, setParagraphs] = useState(0);
  const [totalRating, setTotalRating] = useState("");
  const [headingsRating, setHeadingsRating] = useState("");
  const [paragraphRating, setParagraphRating] = useState("");
  const [customErrorRating, setCustomErrorRating] = useState("");
  const [posts, setPosts] = useState([]);
  const [wpUrl, setWpUrl] = useState("");
  const baseUrl = "http://34.247.253.222:5005/api";
  let fetchedPosts = [];
  let url = "";

  useEffect(() => {
    url = window.location.origin;
    url = url.replace(/(^\w+:|^)\/\//, "");
    console.log("url: ", url);
    /* uncomment this when in production
    setWpUrl(url)
    */
    setWpUrl("linnsreise.no");
  }, []);

  useEffect(() => {
    if (wpUrl.length > 1) {
      console.log("bigger than 1");
      getBlogIdFromUrl();
    }
  }, [wpUrl]);

  useEffect(() => {
    getPosts();
  }, [blogId]);

  const getPost = useCallback(async () => {
    await fetch(baseUrl + "/posts/" + postId)
      .then((res) => res.json())
      .then((data) => {
        console.log("Data: ", data[0]);
        if (data[0] === undefined) return;
        setTitle(data[0].title);
        getAuthor(data[0].blog_id);
        setDateCreated(data[0].created_date);
        setWords(data[0].word_count);
        setHeadings(data[0].headings_count);
        setParagraphs(data[0].paragraph_count);
        setTotalRating(data[0].total_rating);
        setHeadingsRating(data[0].headings_rating);
        setParagraphRating(data[0].paragraph_rating);
        setCustomErrorRating(data[0].custom_error_rating);
      });
  }, [postId]);

  const getAuthor = useCallback(async (blogId) => {
    await fetch(baseUrl + "/blogs/" + blogId)
      .then((res) => res.json())
      .then((data) => {
        setAuthor(data[0].name);
      });
  }, []);

  const getPosts = useCallback(async () => {
    if (blogId.length < 1) return;

    await fetch(baseUrl + "/user/" + blogId + "/posts")
      .then((res) => res.json())
      .then((data) => {
        if (data[0] === undefined) return;
        data.map((d) => {
          fetchedPosts.push({ id: d.id, title: d.title });
        });
        setPosts(fetchedPosts);
        console.log(fetchedPosts);
      });
  }, [blogId]);

  const getBlogIdFromUrl = useCallback(async () => {
    console.log("getBlogIdFromUrl: " + wpUrl);
    await fetch(baseUrl + "/url/" + wpUrl)
      .then((res) => res.json())
      .then((data) => {
        if (data[0] === undefined) return;
        console.log("data:", data);
        setBlogId(data[0].id);
      });
  }, [wpUrl]);

  useEffect(() => {
    getPost();
  }, [postId]);

  return (
    <div className="wrap">
      <h1>Score</h1>

      <select
        value={postId}
        onChange={(e) => setPostId(String(e.target.value))}
      >
        <option value="0" disabled hidden>
          Vælg Post
        </option>
        {posts.map((d) => (
          <option key={d.id} value={d.id}>
            {d.title}
          </option>
        ))}
      </select>
      <hr></hr>
      <p>
        Af: {author} - Skrevet: {dateCreated}
      </p>
      <p>Antall ord: {words}</p>
      <p>Antall overskrifter: {headings}</p>
      <p>Antall avsnitt: {paragraphs}</p>

      <details open>
        <summary>Samlet karakter: {totalRating}</summary>
        <p>{scoringText.TEST_TEXT}</p>
      </details>

      <details>
        <summary>Overskrifter: {headingsRating}</summary>
        <p>{scoringText.TEST_TEXT}</p>
      </details>

      <details>
        <summary>Avsnitt: {paragraphRating}</summary>
        <p>{scoringText.TEST_TEXT}</p>
      </details>

      <details>
        <summary>Tilpasset: {customErrorRating}</summary>
        <p>{scoringText.TEST_TEXT}</p>
      </details>
      <p>
        For mer informasjon om hvordan man skriver gode artikler og hvordan
        evalueringen foregår, <a href="https://upfeed.no">klikk her.</a>
      </p>
    </div>
  );
}

Admin.propTypes = {
  wpObject: PropTypes.object,
};
