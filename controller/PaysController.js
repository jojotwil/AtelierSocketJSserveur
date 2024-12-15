const express = require('express');
const Pays = require('../model/pays');

async function getAll(req, res) {
    try {
        const pays = await Pays.find();
        res.send(pays);
    } catch (error) {
        res.status(500).send(error);
    }
}
async function getById(req, res) {
    try {
        const pays = await Pays.findById(req.params.id);
        res.send(pays);
    } catch (error) {
        res.status(500).send(error);
    }
}

async function add(req, res) {
    try {
        const newPays = new Pays(req.body);
        await newPays.save();
        res.status(200).send("Pays ajouté avec succès");
    } catch (error) {
        res.status(400).send({ error: error.toString() });
    }
}
async function deletebyid(req, res) {
    try {
        const pays = await Pays.findByIdAndDelete(req.params.id);
        res.send(pays);
    } catch (error) {
        res.status(500).send(error);
    }
}
async function update(req, res) {
    try {
        const pays = await Pays.findByIdAndUpdate(req.params.id, req.body);
        res.send(pays);
    } catch (error) {
        res.status(500).send(error);
    }
}   

module.exports = {
    getAll
    ,getById
    ,add
    ,deletebyid
    ,update
}