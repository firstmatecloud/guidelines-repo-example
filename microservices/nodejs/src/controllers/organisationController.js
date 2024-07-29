import organisationService from "../services/organisationService.js";
import epicService from "../services/epicService.js";
import gitService from "../services/gitService.js";

class OrganisationController {
    async getOrg(req, res, next) {
        try {
            const orgId = req.params.orgId;
            const response = await organisationService.getOrganisation(orgId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async repoRefresh(req, res, next) {
        try {
            const orgId = req.params.orgId;
            const response = await gitService.updateRepos(orgId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }
    async initProvider(req, res, next) {
        try {
            const orgId = req.params.orgId;
            const response = await gitService.initProviderAccessRight(orgId, req.body);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async getOrgEpics(req, res, next) {
        try {
            const orgId = req.params.orgId;
            const response = await epicService.getOrgEpics(orgId);
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

    async createEpic(req, res, next) {
        try {
            const orgId = req.params.orgId;
            const response = await epicService.create(orgId, req.body)
            return res.send(response);
        } catch (err) {
            next(err);
        }
    }

}

export default new OrganisationController();
