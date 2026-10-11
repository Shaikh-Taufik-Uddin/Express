const express = require("express");
const fs = require("fs");
const app = express();
const data = require("./files/MOCK_DATA.json");
app.use(express.urlencoded({ extended: false })); // using a middleware to process POST request data
app.get("/employee/:id", (req, res) => {
  const id = Number(req.params.id);
  const user = data.find((ele) => {
    return ele.id === id;
  });
  res.json(user);
});
app.post("/employee", (req, res) => {
  const body = req.body;
  const id = Number(data.length + 1);
  data.push({ ...body, id }); // storing in RAM
  const userdetails = JSON.stringify(data); // preparing to be stored in local storage the whole data is stringified (along with new entry)
  fs.writeFile("./files/MOCK_DATA.json", `${userdetails}`, () =>
    res.send("Data saved successfully"),
  );
});
// implementing all the methods GET POST PUT PATCH DELETE
app
  .route("/student/:id") // for writing multiple actions for the same route
  .get((req, res) => {
    // get request to read an existing entry
    res.set({
      // settting a custom header
      "X-my-name": "Taufik",
    });
    res.status(200).json({
      // we used status code
      data: data,
      message: "hello",
    });
  })
  .post((req, res) => {
    // post request to make a new entry
    const body = req.body;
    data.push(body);
    fs.writeFile(
      "./files/MOCK_DATA.json",
      JSON.stringify(data),
      "utf-8",
      () => {
        res.send("New Student created successfully");
      },
    );
  })
  .put((req, res) => {
    //put request to update/overwrite whole element at once
    const body = req.body;
    const id = Number(req.params.id); // getting the id that is to be deleted
    data[id] = { ...body, id: 9999 * Math.random() }; // assigning a new random id
    fs.writeFile("./files/MOCK_DATA.json", JSON.stringify(data), () => {
      res.send("we have deleted the previous entry updated the entity");
    });
  })
  .patch((req, res) => {
    //patch request to partial update / update some fields
    const body = req.body;
    const id = Number(req.params.id);
    data[id] = { ...data[id], ...body, id };
    fs.writeFile("./files/MOCK_DATA.json", JSON.stringify(data), () => {
      res.send("partial update complete");
    });
  })
  .delete((req, res) => {
    // delete request to delete an entry
    const id = Number(req.params.id);
    data.splice(id, 1); // splice takes the starting index to delete at and the number of elements to delete and also takes the (optional) elements to insert
    fs.writeFile("./files/MOCK_DATA.json", JSON.stringify(data), () => {
      res.send("Student Deleted Successfully");
    });
  });
app.listen(3000, () => {
  console.log("server started at port 3000");
});
