import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateRuleRequest, Rule, UpdateRuleRequest } from "../model/rules.model";

@Injectable({
    providedIn: 'root',
})
export class RulesService {
    constructor(
        private readonly http: HttpClient
    ) {}

    getRules() {
        return this.http.get<Rule[]>('rules', { observe: 'response' });
    }

    getRule(id: string) {
        return this.http.get<Rule>(`rules/${id}`, { observe: 'response' });
    }

    createRule(data: CreateRuleRequest) {
        return this.http.post<Rule>('rules', data, { observe: 'response' });
    }

    updateRule(id: string, data: UpdateRuleRequest) {
        return this.http.patch<Rule>(`rules/${id}`, data, { observe: 'response' });
    }

    deleteRule(id: string) {
        return this.http.delete(`rules/${id}`, { observe: 'response' });
    }
}
