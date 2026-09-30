import { Avatar } from './Avatar';

const contacts = [
  { name: 'Laura Gomez', avatar: 'LG' },
  { name: 'Andres Ruiz', avatar: 'AR' },
  { name: 'Sofia Perez', avatar: 'SP' },
  { name: 'Carlos Diaz', avatar: 'CD' },
];

export function Contacts() {
  return (
    <aside className="rail" aria-label="Contactos">
      <section className="contacts">
        <h2 className="rail-title">Contactos</h2>
        {contacts.map((contact) => (
          <div className="contact" key={contact.name}>
            <Avatar initials={contact.avatar} size="tiny" />
            <span>{contact.name}</span>
            <span className="online-dot" aria-label="En linea" />
          </div>
        ))}
      </section>
    </aside>
  );
}
