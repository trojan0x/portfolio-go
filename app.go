package main

import (
	"fmt"
	"log"
	"net/http"
	"os"

	mailjet "github.com/mailjet/mailjet-apiv3-go"
)

type MailRequestBody struct {
	Name    string
	Email   string
	Message string
}

func SendMailHandler(w http.ResponseWriter, r *http.Request) {
	var err error

	if r.Method == "POST" {
		mailRequestBody := MailRequestBody{
			Name:    r.PostFormValue("name"),
			Email:   r.PostFormValue("email"),
			Message: r.PostFormValue("message"),
		}

		publicKey := os.Getenv("MJ_APIKEY_PUBLIC")
		secretKey := os.Getenv("MJ_APIKEY_PRIVATE")

		mj := mailjet.NewMailjetClient(publicKey, secretKey)

		param := &mailjet.InfoSendMail{
			FromEmail: "website@dpstudios.es",
			FromName:  "Portfolio Mailer",
			To:        "daniel@dpstudios.es",
			Subject:   "Portfolio Message",
			Headers: map[string]string{
				"Reply-To": mailRequestBody.Name + "<" + mailRequestBody.Email + ">",
			},
			TextPart: mailRequestBody.Message,
		}

		_, err = mj.SendMail(param)

		if err != nil {
			w.WriteHeader(500)
			fmt.Fprintf(w, "ERROR")
			log.Println(err)
		} else {
			w.WriteHeader(200)
			fmt.Fprintf(w, "SUCCESS")
		}
	} else {
		w.WriteHeader(404)
		fmt.Fprintf(w, "NOT FOUND")
	}
}

func main() {
	// Handler send-mail
	http.HandleFunc("/send-mail", SendMailHandler)

	// Serve static files
	fs := http.FileServer(http.Dir("static"))
	http.Handle("/", fs)

	// Start server
	log.Println("Listening...")
	http.ListenAndServe(":3000", nil)
}
