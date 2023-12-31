//se importan los modulos
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserAppointments } from "../../services/appointment.service";
import { openModal } from "../../redux/slices/modal.slice";
import { setAppointments as setAppoinmentsStore } from "../../redux/slices/appointments.slice";
import { BsSearch } from "react-icons/bs"; // Importa BsSearch de 'react-icons/bs'

//componentes
import CardAppointments from "../../components/CardAppointments";
import CustomButton from "../../components/CustomButton";
import ModalAppointments from "../../components/ModalAppointments";
import InputSearch from "../../components/InputSearch";

//ir entre links
import { useNavigate } from "react-router-dom";

const Appointment = () => {
  const dispatch = useDispatch();

  //hook para control de las citas
  const [appointments, setAppointments] = useState([]);
  const [filter, setFilter] = useState("");

  //obtencion de datos desde el store
  const authToken = useSelector((state) => state.user.credentials.token);
  const userRoleId = useSelector((state) => state.user.data.roleId);
  const navigate = useNavigate();

  //control de cierre del modal
  const handleOpenModal = (appointmentId) => {
    dispatch(openModal(appointmentId));
  };

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Obtener las citas del usuario utilizando el token del estado de Redux
        const userAppointments = await getUserAppointments(authToken);
        // Establecer las citas en el estado local
        setAppointments(userAppointments.data);
        console.log(userAppointments.data);
      } catch (error) {
        console.log("Error al obtener las citas del usuario:", error);
      }
    };
    fetchAppointments();
  }, [authToken]);

  //se ejecuta cada vez que cambie el valor de appointments o dispatch (actualicen las citas)
  useEffect(() => {
    if (appointments?.length) {
      dispatch(setAppoinmentsStore(appointments));
    }
  }, [appointments, dispatch]);

  const filteredAppointmentsList = appointments.filter((appointment) => {
    const { dentist } = appointment;
    const searchTerm = filter.toLowerCase();

    const dentistFullName = `${dentist.name} ${dentist.lastName}`.toLowerCase();

    return (
      dentistFullName.includes(searchTerm)
    );
  });

  const handleChange = (e) => {
    setFilter(e.target.value);

  };

  return (
    <>
      <div className="bg-secondary-100 p-8 rounded-xl mb-8">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <h1 className="text-xl text-primary font-bold mb-4 md:mb-0 md:text-left md:flex-grow">
            MIS CITAS
          </h1>
          <div className=" -mr-6 md:mr-4 mb-2 scale-75 md:scale-100 md:mb-0 flex justify-end items-end">
            {/* <InputSearch  />*/}
            <form className="max-w-sm">
              <div className="relative">
                <BsSearch className="absolute top-2 left-2" />
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="w-full py-2 pl-10 pr-3 text-gray-500 rounded-lg outline-none bg-gray-50 focus:ring-2 focus:ring-primary border-none text-sm"
                  value={filter}
                  onChange={handleChange}
                />
              </div>
            </form>
          </div>
          <div className="scale-80 md:scale-100 flex justify-end">
            <CustomButton onClick={() => navigate("/newAppointment")}>
              CREAR CITA
            </CustomButton>
          </div>{" "}
        </div>
        <hr className="my-8 border-gray-500/30" />
        {/* SUBTITULOS PARA LAS CARDS */}
        <div className="subtitleAppointmet hidden md:block">
          <div className=" p-2 md:p-2 rounded-xl mb-4">
            <div className="flex justify-center ml-20 md:justify-between flex-wrap items-center gap-2 md:gap-4">
              {/* INTERVENTION */}
              <div className="w-full md:w-1/5">
                <p className="text-sm md:text-base">
                  <span className="font-semibold">INTERVENCIÓN</span>
                </p>
              </div>
              {/* DOCTOR */}
              {userRoleId !== 2 && (
                <div className="w-full md:w-1/4">
                  <p className="text-sm md:text-base">
                    <span className="font-semibold">DENTISTA</span>
                  </p>
                </div>
              )}
              {/* PATIENTS */}
              {userRoleId !== 3 && (
                <div className="w-full md:w-1/4">
                  <p className="text-sm md:text-base">
                    <span className="font-semibold">PACIENTES</span>
                  </p>
                </div>
              )}
              {/* FECHA */}
              <div className="w-full md:w-1/6">
                <p className="text-sm md:text-base">
                  <span className="font-semibold">FECHA</span>
                </p>
              </div>
              {/* HORARIO */}
              <div className="w-full md:w-1/6">
                <p className="text-sm md:text-base">
                  <span className="font-semibold">HORARIO</span>
                </p>
              </div>
            </div>
          </div>
        </div>
        {filteredAppointmentsList.map((appointment) => (
          <>
            <CardAppointments
              key={appointment.id}
              intervention={appointment.intervention.name}
              dentist={
                appointment.dentist.name + " " + appointment.dentist.lastName
              }
              patient={
                appointment.patient.name + " " + appointment.patient.lastName
              }
              date={appointment.date}
              startTime={appointment.startTime}
              endTime={appointment.endTime}
              // Mostrar paciente si userRoleId es igual a 2
              showPatient={userRoleId === 2}
              // Mostrar dentista si userRoleId es igual a 3
              showDentist={userRoleId === 3}
              onClick={() => handleOpenModal(appointment.id)}
            />
          </>
        ))}
        <ModalAppointments />
      </div>
    </>
  );
};

export default Appointment;
