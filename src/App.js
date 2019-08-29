import React from 'react';
import './App.css';

class DevisDisplay extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null,
      isLoaded: false,
      isMetier: false,
      items: [],
      HT: "",
      TTC: "",
      customerName: "",
      customerEmail: "",
      address: "",
      postalCode: "",
      city: "",
    };
    this.changeDisplay = this.changeDisplay.bind(this);
    this.customer = this.customer.bind(this);
  }

  componentDidMount() {
    fetch("https://api.travauxlib.com/api/devis-pro/JKusHl8Ba8MABIjdCtLZOe2lxxnUfX")
      .then(res => res.json())
      .then(
        (result) => {
          this.setState({
            isLoaded: true,
            isMetier: true,
            items: result.lots,
            HT: result.prixTotalHT,
            TTC: result.prixTotalTTC,
            customerName: result.deal.customerName,
            customerEmail: result.deal.customerEmail,
            address: result.deal.billingAddress.address,
            postalCode: result.deal.billingAddress.postalCode,
            city: result.deal.billingAddress.city,
          });
        },
        (error) => {
          this.setState({
            isLoaded: true,
            isMetier: true,
            error
          });
        }
      )
  }

  changeDisplay() {
    this.setState({
      isMetier: !this.state.isMetier
    });
  }

  roomList() {
    let listSorted = [
      { label: "Salle d'eau", tasks: [], HT: 0, TTC: 0 },
      { label: "Cuisine", tasks: [], HT: 0, TTC: 0 },
      { label: "Salon", tasks: [], HT: 0, TTC: 0 },
      { label: "Chambre", tasks: [], HT: 0, TTC: 0 },
      { label: "Autre Prestations", tasks: [], HT: 0, TTC: 0 }
    ];
    const { items } = this.state;

    items.forEach(item => {
      item.lignes.forEach(task => {
        if (!task.locationsDetails.quantityIsByLocation) {
          if (!listSorted[4].tasks.includes(task.designation))
            listSorted[4].tasks.push(task.designation);
          listSorted[4].HT += task.prixHT;
          listSorted[4].TTC += task.prixTTC;
        }
        else {
          task.locationsDetails.locations.forEach(roomUuid => {
            switch (roomUuid.uuid) {
              case '35c15ae1-4258-4a56-b61c-6bb6a2140e25':
                if (!listSorted[0].tasks.includes(task.designation))
                  listSorted[0].tasks.push(task.designation);
                listSorted[0].HT += task.prixHT;
                listSorted[0].TTC += task.prixTTC;
                break;
              case 'c85c00a8-6316-4ed4-8c58-aa55127edc99':
                if (!listSorted[1].tasks.includes(task.designation))
                  listSorted[1].tasks.push(task.designation);
                listSorted[1].HT += task.prixHT;
                listSorted[1].TTC += task.prixTTC;
                break;
              case '8ebec007-b267-481e-88b3-7d2f2f3df1b7':
                if (!listSorted[2].tasks.includes(task.designation))
                  listSorted[2].tasks.push(task.designation);
                listSorted[2].HT += task.prixHT;
                listSorted[2].TTC += task.prixTTC;
                break;
              default:
                if (!listSorted[3].tasks.includes(task.designation))
                  listSorted[3].tasks.push(task.designation);
                listSorted[3].HT += task.prixHT;
                listSorted[3].TTC += task.prixTTC;
                break;
            }
          });
        }
      })
    });

    return listSorted;
  }

  customer() {
    const { customerName, customerEmail, address, postalCode, city, HT, TTC} = this.state;
    return (
      <div>
        <div className="customerInfo">
          <h3>
            Devis pour {customerName} <br />
            Adresse email : {customerEmail} <br />
            Adresse : {address} <br />
            Ville : {city} <br />
            Code postal : {postalCode} <br />
          </h3>
        </div>
        <div className="priceInfo">
          <h3>
            Résumé de la commande : <br /><br />
            Prix HT : {HT} euros <br /><br />
            Prix TTC : {TTC} euros <br />
          </h3>
        </div>
      </div>
    );
  }

  render() {
    const { error, isLoaded, items, HT, TTC } = this.state;
    if (error) {
      return <div>Error: {error.message}</div>;
    } else if (!isLoaded) {
      return <div>Loading...</div>;
    } else if (this.state.isMetier) {
      return (
        <div className="container">
          {this.customer()}
          <h3>Affichage par lots métiers :</h3>
          <button className="switchbtn" type="button" onClick={this.changeDisplay}>changer affichage</button>
          <ul>
            {items.map(item => (
              <li key={item.label}>
                {item.label}
                <ul>
                  {item.lignes.map(metier => (
                    <li key={metier.designation}>
                      {metier.designation}
                    </li>
                  ))}
                  Prix HT : {item.prixTotalHT} euros
                      <br />
                  Prix TTC : {item.prixTotalTTC} euros
                </ul>
              </li>
            ))}
          </ul>
          <hr className="new1"></hr>
          <label>Prix HT : {HT} euros</label>
          <hr className="new1"></hr>
          <label>Prix TTC : {TTC} euros</label>
        </div>
      );
    }
    else {
      const itemsByRooms = this.roomList();
      return (
        <div className="container">
          {this.customer()}
          <h3>Affichage par piéces :</h3>
          <button className="switchbtn" type="button" onClick={this.changeDisplay}>changer affichage</button>
          <ul>
            {itemsByRooms.map(item => (
              <li key={item.label}>
                {item.label}
                <ul>
                  {item.tasks.map(task => (
                    <li key={task}>
                      {task}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
          <hr className="new1"></hr>
          <label>Prix HT : {HT} euros</label>
          <hr className="new1"></hr>
          <label>Prix TTC : {TTC} euros</label>
        </div>
      );
    }
  }
}

export default DevisDisplay;
