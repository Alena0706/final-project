const FranchiseService = require("../services/franchise.service");

class FranchiseController {
 
    static async getAllFranchises(req, res) {
        try {
            const franchises = await FranchiseService.getAllFranchises();
            res.status(200).json(franchises);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateFranchise(req, res) {
        try {
            if (!res.locals.user.admin) {
                res.status(403).json({ message: "Только админ может вносить изменения" });
            }   
            const franchise = await FranchiseService.updateFranchise(req.body);
            res.status(200).json(franchise);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async createFranchise(req, res) {
        try {
            if (!res.locals.user.admin) {
                res.status(403).json({ message: "Только админ может вносить изменения" });
            }   
            const franchise = await FranchiseService.createFranchise(req.body);
            res.status(201).json(franchise);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async deleteFranchise(req, res) {
        try {
            if (!res.locals.user.admin) {
                res.status(403).json({ message: "Только админ может вносить изменения" });
            }   
            const franchise = await FranchiseService.deleteFranchise(req.body);
            res.status(200).json(franchise);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async uploadImage(req, res) {
        try {
            if (!res.locals.user.admin) {
                res.status(403).json({ message: "Только админ может вносить изменения" });
            }   
            const franchise = await FranchiseService.uploadImage(req.file, req.body.id);
            res.status(200).json(franchise);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = FranchiseController;