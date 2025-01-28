from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import os
from dotenv import load_dotenv
import requests
from typing import Optional
import datetime

load_dotenv()

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

RIOT_API_KEY = os.getenv('RIOT_API_KEY')
BASE_URLS = {
    'na1': 'https://na1.api.riotgames.com',
    'americas': 'https://americas.api.riotgames.com',
}

VALID_REGIONS = {
    'na1': 'americas',
    'euw1': 'europe',
    'kr': 'asia',
    'br1': 'americas',
    'eun1': 'europe',
    'jp1': 'asia',
    'la1': 'americas',
    'la2': 'americas',
    'oc1': 'americas',
    'tr1': 'europe',
    'ru': 'europe',
}

class TftAPI:
    def __init__(self):
        if not RIOT_API_KEY:
            raise ValueError("RIOT_API_KEY environment variable is not set")
        self.headers = {"X-Riot-Token": RIOT_API_KEY}
        self.timeout = 10

    def get_account_by_riot_id(self, game_name: str, tag_line: str) -> Dict:
        """Get account info using Riot ID (game name and tag)"""
        url = f"{BASE_URLS['americas']}/riot/account/v1/accounts/by-riot-id/{game_name}/{tag_line}"
        response = requests.get(url, headers=self.headers, timeout=self.timeout)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code, 
                              detail=f"Error fetching account: {response.json().get('status', {}).get('message', 'Unknown error')}")
        return response.json()

    def get_summoner_by_puuid(self, puuid: str, region: str) -> Dict:
        """Get summoner info using PUUID"""
        url = f"{BASE_URLS[region]}/lol/summoner/v4/summoners/by-puuid/{puuid}"
        response = requests.get(url, headers=self.headers, timeout=self.timeout)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                              detail=f"Error fetching summoner: {response.json().get('status', {}).get('message', 'Unknown error')}")
        return response.json()

    def get_tft_data_by_summoner_id(self, summoner_id: str, region: str) -> Dict:
        """Get TFT league data using summoner ID"""
        url = f"{BASE_URLS[region]}/tft/league/v1/entries/by-summoner/{summoner_id}"
        response = requests.get(url, headers=self.headers, timeout=self.timeout)
        if response.status_code != 200:
            raise HTTPException(status_code=response.status_code,
                              detail=f"Error fetching TFT data: {response.json().get('status', {}).get('message', 'Unknown error')}")
        return response.json()

tft_api = TftAPI()

@app.get("/health")
async def health_check():
    api_status = tft_api.validate_api_key()
    return {
        "status": "ok" if api_status else "error",
        "message": "TFT API is running" if api_status else "Invalid API key",
        "api_key_valid": api_status,
        "timestamp": datetime.datetime.now().isoformat()
    }

@app.get("/api/meta-comps")
async def get_meta_compositions():
    return {
        "compositions": [
            {
                "name": "Yordle Rush",
                "tier": "S",
                "champions": ["Veigar", "Heimerdinger", "Poppy", "Lulu", "Tristana"],
                "traits": ["Yordle", "Mage", "Gunner"]
            },
            {
                "name": "Assassin Carry",
                "tier": "A",
                "champions": ["Katarina", "Akali", "Pyke", "Zed", "Kayn"],
                "traits": ["Assassin", "Ninja"]
            },
            {
                "name": "Tank Meta",
                "tier": "B",
                "champions": ["Malphite", "Rammus", "Ornn", "Sejuani"],
                "traits": ["Vanguard", "Brawler"]
            }
        ]
    }

@app.get("/api/augments")
async def get_augments():
    return {
        "augments": [
            {
                "name": "Example Augment",
                "tier": 1,
                "description": "Example description"
            }
        ]
    }

@app.get("/api/tft/summoner/{region}/{game_name}/{tag_line}")
async def get_player_tft_data(region: str, game_name: str, tag_line: str):
    try:
        # Step 1: Get PUUID from Riot ID
        account_data = tft_api.get_account_by_riot_id(game_name, tag_line)
        puuid = account_data['puuid']

        # Step 2: Get Summoner ID from PUUID
        summoner_data = tft_api.get_summoner_by_puuid(puuid, region)
        summoner_id = summoner_data['id']

        # Step 3: Get TFT data using Summoner ID
        tft_data = tft_api.get_tft_data_by_summoner_id(summoner_id, region)

        return {
            "account": account_data,
            "summoner": summoner_data,
            "tft_data": tft_data
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/tft/match/{match_id}")
async def get_match_details(match_id: str):
    try:
        match_data = tft_api.get_tft_match(match_id)
        return match_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))