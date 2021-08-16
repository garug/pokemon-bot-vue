import axios from "axios";

interface CreateOffer {
  owner: {
    id: string;
    pokemon_id: string;
  };
  offeror: {
    id: string;
    pokemon_id: string;
  };
}

const url = `${process.env.VUE_APP_BACKEND_URL}/offers`;

export async function getOffers(player_id: string) {
  return axios.get(url);
}

export async function createOffer(create: CreateOffer) {
  return axios.post(url, create);
}

export async function createApprovalStatus(idOffer: string, status: boolean) {
  return axios.post(`${url}/${idOffer}/approval-status`, {
    status,
  });
}
