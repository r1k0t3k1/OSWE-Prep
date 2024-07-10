package com.offsec.awae;

import java.util.Random;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.PostMapping;


@Controller
public class MainController {

	private Random random = new Random();
	private int answer;
	
	
	@PostMapping("/guess")
	public String getGuess(HttpServletRequest req, Model model, HttpServletResponse res) {
		String msg = "";
		if(answer == 0) {
			regenerateAnswer();
		}
		int guess = 0;
		if(req.getParameter("number")!= null) {
			try {
				guess = Integer.parseInt(req.getParameter("number"));
				if(answer == guess) {
					msg = "That is correct! The number was " + answer + ". Want to play again?";
					regenerateAnswer();
				} else {
					msg = "That is incorrect! Guess again?";
				}
			} catch(Exception e) {
				msg = "That wasn't a number. Guess again?";
			}
		} else {
			msg = "That wasn't a number. Guess again?";
		}
		model.addAttribute("message", msg);
		return "game";
	}
	
	private void regenerateAnswer() {
		answer = random.nextInt(100)+1;
	}
}
