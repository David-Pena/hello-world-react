import { useState, useEffect, useCallback } from 'react';
import { BiCalendar } from 'react-icons/bi';
import Search from './components/Search';
import AddAppointment from './components/AddAppointment';
import AppointmentInfo from './components/AppointmentInfo';

function App() {

  let [appointmentList, setAppointmentList] = useState([]);
  let [query, setQuery] = useState('');
  let [sortBy, setSortBy] = useState('petName');
  let [orderBy, setOrderBy] = useState('asc');

  // a copy of the original list will handle the search filter
  // and will be used to display the data to the user
  const filteredAppointments = appointmentList.filter((appointment) => {

    let search = query.toLowerCase();

    return (
      appointment.petName.toLowerCase().includes(search) ||
      appointment.ownerName.toLowerCase().includes(search) ||
      appointment.aptNotes.toLowerCase().includes(search)
    )
  }).sort((a, b) => {
    let order = (orderBy === 'asc') ? 1 : -1;
    return (
      a[sortBy].toLowerCase() < b[sortBy].toLowerCase() ? -1 * order : 1 * order
    )
  })

  // simulate api call but instead looking for it in our public dir.
  const fetchData = useCallback(() => {
    fetch('./data.json')
      .then(res => res.json())
      .then(data => {
        setAppointmentList(data);
      });
  }, [])

  // invoke our fetchData method and then keep track of any changes that ocurred with it.
  useEffect(() => {
    fetchData()
  }, [fetchData]);

  const handleDeleteAppointment = (appointmentId) => {
    setAppointmentList(
      appointmentList.filter(appointment => appointment.id !== appointmentId)
    )
  }

  return (
    <div className="App container mx-auto mt-3 font-thin">
      <h1 className="text-5xl mb-5">
        <BiCalendar className="inline-block text-red-400 align-top" /> Your Appointments</h1>
      <AddAppointment
        lastId={appointmentList.reduce((max, item) => Number(item.id) > max ? Number(item.id) : max, 0)}
        onSendAppointment={myAppointment => setAppointmentList([...appointmentList, myAppointment])}
      />
      <Search 
        query={query}
        onQueryChange={myQuery => setQuery(myQuery)}
        orderBy={orderBy}
        onOrderByChange={myOrder => setOrderBy(myOrder)}
        sortBy={sortBy}
        onSortByChange={mySort => setSortBy(mySort)}
      />

      <ul className="divide-y divide-gray-200">
        {filteredAppointments.map(appointment => (
          <AppointmentInfo 
            key={appointment.id}
            appointment={appointment} 
            onDeleteAppointment={
              appointmentId => handleDeleteAppointment(appointmentId)
            }
          />
        ))}
      </ul>
    </div>
  );
}

export default App;
