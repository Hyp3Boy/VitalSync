from api.api import init_api

def main():
    import uvicorn
    print("Starting VitalSync API server...")
    app = init_api()
    uvicorn.run(app, host="0.0.0.0", port=8000)

if __name__ == "__main__":
    main()
