FROM python:3.10
WORKDIR /app
COPY . /app
RUN pip install --no-cache-dir -r requirements.txt
CMD ["waitress-serve", "--listen=0.0.0.0:5000", "shareAccess:app"]
