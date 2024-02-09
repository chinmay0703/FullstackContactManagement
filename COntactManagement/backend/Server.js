const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;
mongoose.connect('mongodb+srv://chinmay:LIP54dqmq0o0dODS@contact.cjo104s.mongodb.net/?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true });
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    address: String,
    companyName: String,
});

const Contact = mongoose.model('Contact', contactSchema);
app.use(cors());
app.use(bodyParser.json());

app.post('/postdata', async (req, res) => {
    try {
        const { name, phone, address, companyName } = req.body;
        const newContact = new Contact({
            name,
            phone,
            address,
            companyName,
        });
        await newContact.save();
        res.status(200).json({ message: 'Contact form data successfully saved to MongoDB!' });
    } catch (error) {
        console.error('Error adding contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.put('/updatedata/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        const updatedData = req.body;
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contactId format' });
        }
        const updatedContact = await Contact.findByIdAndUpdate(contactId, updatedData, { new: true });
        if (updatedContact) {
            res.json({ message: 'Contact updated successfully', updatedContact });
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        console.error('Error updating contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


app.get('/getcontacts', async (req, res) => {
    try {
        const contacts = await Contact.find();
        res.status(200).json(contacts);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.get('/getbyid', async (req, res) => {
    try {
        const id = req.query.id;
        if (!id || !mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ error: 'Invalid or missing ID parameter' });
        }
        const data = await Contact.findById(id);

        if (data) {
            res.json(data);
        } else {
            res.status(404).json({ error: 'Data not found' });
        }
    } catch (error) {
        console.error('Error fetching data by ID:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.delete('/deletecontact/:id', async (req, res) => {
    try {
        const contactId = req.params.id;
        console.log("contact of the id ", contactId, "is deleted");
        if (!mongoose.Types.ObjectId.isValid(contactId)) {
            return res.status(400).json({ error: 'Invalid contactId format' });
        }
        const deletedContact = await Contact.findOneAndDelete({ _id: contactId });
        if (deletedContact) {
            res.json({ message: 'Contact deleted successfully' });
        } else {
            res.status(404).json({ error: 'Contact not found' });
        }
    } catch (error) {
        console.error('Error deleting contact:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});




app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
