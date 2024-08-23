import MyTextInput from "@/components/MyTextInput";
import { Form, Formik } from "formik";
import Head from "next/head";
import { MdDeleteForever } from "react-icons/md";
import { useState } from "react";
import { server } from "./../config/index";

export function DrugItem({ drug, onClick }) {
  return (
    <li className="list-group-item d-flex justify-content-between">
      <span className="fw-bold px-3 mr-auto">{drug.name}</span>
      <button className="btn btn-danger" onClick={() => onClick(drug.id)}>
        <MdDeleteForever />
      </button>
    </li>
  );
}

export default function Home() {
  const [id, setId] = useState(0);
  const [drugList, setDrugList] = useState([]);
  const [interactionTable, setInteractionTable] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const submitList = async () => {
    setIsLoading(true);

    // To api call
    try {
      const result = await fetch(`${server}/api/getInteraction`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          drugList: drugList,
        }),
      });

      const res = await result.json();
      const interactions = res.interactions;
      console.log("interactions = ", interactions);

      setInteractionTable(interactions);
    } catch (error) {
      console.log("Error occured: ", error);
    }
    // set Table

    setIsLoading(false);
  };

  const onDeleteHandler = (id) => {
    setDrugList(drugList.filter((drug) => drug.id !== id));
  };

  const addDrugHandler = (values) => {
    const drugObj = { id: id, name: values.name };
    const newDrugList = drugList.concat(drugObj);

    setId(id + 1);
    setDrugList(newDrugList);
  };

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="col container">
        <div className="row text-center">
          <h2 className="">My Drug List</h2>
        </div>

        <div className="row justify-content-md-center my-3">
          <div className="card">
            <div className="card-body">
              <Formik initialValues={{ name: "" }} onSubmit={addDrugHandler}>
                <Form>
                  <MyTextInput
                    label="Drug Name"
                    name="name"
                    type="text"
                    placeholder="Enter Drug Name"
                    className=""
                  />

                  <div className="col-12 ms-5 mt-3">
                    <button type="submit" className="btn btn-primary">
                      Add
                    </button>
                  </div>
                </Form>
              </Formik>
            </div>
          </div>
        </div>

        <ul className="list-group row">
          {drugList.map((drug) => (
            <DrugItem key={drug.id} drug={drug} onClick={onDeleteHandler} />
          ))}
        </ul>

        <div className="d-flex justify-content-center my-3">
          <button className="btn btn-primary px-3" onClick={submitList}>
            Submit List
          </button>
        </div>

        {isLoading && <div> Loading ... </div>}

        {!isLoading && interactionTable.length !== 0 && (
          <InteractionTable interactionTable={interactionTable} />
        )}

        {!isLoading && interactionTable.length !== 0 && (
          <div className="">
            *Note:
            <b>
              Unknown interaction means there might be an interaction between
              the drugs but with unknown severity.
            </b>
          </div>
        )}
      </main>
    </>
  );
}

const InteractionTable = ({ interactionTable }) => {
  return (
    <table className="table">
      <thead>
        <tr>
          <th scope="col"> # </th>
          <th scope="col"> Drug 1 </th>
          <th scope="col"> Drug 2 </th>
          <th scope="col"> Level </th>
        </tr>
      </thead>
      <tbody>
        {interactionTable.map((interaction, ind) => (
          <InteractionRow key={ind} ind={ind} interaction={interaction} />
        ))}
      </tbody>
    </table>
  );
};

const InteractionRow = ({ ind, interaction }) => {
  return (
    <tr>
      <th scope="row">{ind + 1}</th>
      <td>{interaction.Drug_A}</td>
      <td>{interaction.Drug_B}</td>
      <td>{interaction.Level}</td>
    </tr>
  );
};