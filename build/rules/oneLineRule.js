var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var OPTION_BRACE = "check-open-brace";
var OPTION_CATCH = "check-catch";
var OPTION_ELSE = "check-else";
var OPTION_WHITESPACE = "check-whitespace";
var Rule = (function (_super) {
    __extends(Rule, _super);
    function Rule() {
        _super.apply(this, arguments);
    }
    Rule.prototype.apply = function (sourceFile) {
        var oneLineWalker = new OneLineWalker(sourceFile, this.getOptions());
        return this.applyWithWalker(oneLineWalker);
    };
    Rule.BRACE_FAILURE_STRING = "misplaced opening brace";
    Rule.CATCH_FAILURE_STRING = "misplaced 'catch'";
    Rule.ELSE_FAILURE_STRING = "misplaced 'else'";
    Rule.WHITESPACE_FAILURE_STRING = "missing whitespace";
    return Rule;
})(Lint.Rules.AbstractRule);
exports.Rule = Rule;
var OneLineWalker = (function (_super) {
    __extends(OneLineWalker, _super);
    function OneLineWalker() {
        _super.apply(this, arguments);
    }
    OneLineWalker.prototype.visitIfStatement = function (node) {
        var sourceFile = node.getSourceFile();
        var thenStatement = node.thenStatement;
        if (thenStatement.kind === 163 /* Block */) {
            var expressionCloseParen = node.getChildAt(3);
            var thenOpeningBrace = thenStatement.getChildAt(0);
            if (!this.multilineAndAlignedBrace(node, expressionCloseParen, thenOpeningBrace)) {
                this.handleOpeningBrace(expressionCloseParen, thenOpeningBrace);
            }
        }
        var elseStatement = node.elseStatement;
        if (elseStatement != null) {
            var elseKeyword = OneLineWalker.getFirstChildOfKind(node, 74 /* ElseKeyword */);
            if (elseStatement.kind === 163 /* Block */) {
                var elseOpeningBrace = elseStatement.getChildAt(0);
                this.handleOpeningBrace(elseKeyword, elseOpeningBrace);
            }
            if (this.hasOption(OPTION_ELSE)) {
                var thenStatementEndLine = sourceFile.getLineAndCharacterFromPosition(thenStatement.getEnd()).line;
                var elseKeywordLine = sourceFile.getLineAndCharacterFromPosition(elseKeyword.getStart()).line;
                if (thenStatementEndLine !== elseKeywordLine) {
                    var failure = this.createFailure(elseKeyword.getStart(), elseKeyword.getWidth(), Rule.ELSE_FAILURE_STRING);
                    this.addFailure(failure);
                }
            }
        }
        _super.prototype.visitIfStatement.call(this, node);
    };
    OneLineWalker.prototype.visitTryBlock = function (node) {
        var tryKeyword = node.getChildAt(0);
        var tryOpeningBrace = node.getChildAt(1);
        this.handleOpeningBrace(tryKeyword, tryOpeningBrace);
        _super.prototype.visitTryBlock.call(this, node);
    };
    OneLineWalker.prototype.visitCatchClause = function (node) {
        var catchKeyword = node.getChildAt(0);
        var catchOpeningBrace = node.block.getChildAt(0);
        this.handleOpeningBrace(catchKeyword, catchOpeningBrace);
        _super.prototype.visitCatchClause.call(this, node);
    };
    OneLineWalker.prototype.visitTryStatement = function (node) {
        var sourceFile = node.getSourceFile();
        var catchClause = node.catchClause;
        if (this.hasOption(OPTION_CATCH) && catchClause != null) {
            var tryClosingBrace = node.tryBlock.getChildAt(node.tryBlock.getChildCount() - 1);
            var catchKeyword = catchClause.getChildAt(0);
            var tryClosingBraceLine = sourceFile.getLineAndCharacterFromPosition(tryClosingBrace.getEnd()).line;
            var catchKeywordLine = sourceFile.getLineAndCharacterFromPosition(catchKeyword.getStart()).line;
            if (tryClosingBraceLine !== catchKeywordLine) {
                var failure = this.createFailure(catchKeyword.getStart(), catchKeyword.getWidth(), Rule.CATCH_FAILURE_STRING);
                this.addFailure(failure);
            }
        }
        _super.prototype.visitTryStatement.call(this, node);
    };
    OneLineWalker.prototype.visitForStatement = function (node) {
        this.handleIterationStatement(node);
        _super.prototype.visitForStatement.call(this, node);
    };
    OneLineWalker.prototype.visitForInStatement = function (node) {
        this.handleIterationStatement(node);
        _super.prototype.visitForInStatement.call(this, node);
    };
    OneLineWalker.prototype.visitWhileStatement = function (node) {
        this.handleIterationStatement(node);
        _super.prototype.visitWhileStatement.call(this, node);
    };
    OneLineWalker.prototype.visitBinaryExpression = function (node) {
        if (node.operator === 51 /* EqualsToken */ && node.right.kind === 142 /* ObjectLiteralExpression */) {
            var equalsToken = node.getChildAt(1);
            var openBraceToken = node.right.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }
        _super.prototype.visitBinaryExpression.call(this, node);
    };
    OneLineWalker.prototype.visitVariableDeclaration = function (node) {
        var initializer = node.initializer;
        if (initializer != null && initializer.kind === 142 /* ObjectLiteralExpression */) {
            var equalsToken = node.getChildAt(1);
            var openBraceToken = initializer.getChildAt(0);
            this.handleOpeningBrace(equalsToken, openBraceToken);
        }
        _super.prototype.visitVariableDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitDoStatement = function (node) {
        var doKeyword = node.getChildAt(0);
        var statement = node.statement;
        if (statement.kind === 163 /* Block */) {
            var openBraceToken = statement.getChildAt(0);
            this.handleOpeningBrace(doKeyword, openBraceToken);
        }
        _super.prototype.visitDoStatement.call(this, node);
    };
    OneLineWalker.prototype.visitModuleDeclaration = function (node) {
        var nameNode = node.name;
        var body = node.body;
        if (body.kind === 190 /* ModuleBlock */) {
            var openBraceToken = body.getChildAt(0);
            this.handleOpeningBrace(nameNode, openBraceToken);
        }
        _super.prototype.visitModuleDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitEnumDeclaration = function (node) {
        var nameNode = node.name;
        var openBraceToken = OneLineWalker.getFirstChildOfKind(node, 13 /* OpenBraceToken */);
        this.handleOpeningBrace(nameNode, openBraceToken);
        _super.prototype.visitEnumDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitSwitchStatement = function (node) {
        var closeParenToken = node.getChildAt(3);
        var openBraceToken = node.getChildAt(4);
        this.handleOpeningBrace(closeParenToken, openBraceToken);
        _super.prototype.visitSwitchStatement.call(this, node);
    };
    OneLineWalker.prototype.visitInterfaceDeclaration = function (node) {
        var nameNode = node.name;
        var openBraceToken = OneLineWalker.getFirstChildOfKind(node, 13 /* OpenBraceToken */);
        this.handleOpeningBrace(nameNode, openBraceToken);
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitClassDeclaration = function (node) {
        var nameNode = node.name;
        var openBraceToken = OneLineWalker.getFirstChildOfKind(node, 13 /* OpenBraceToken */);
        this.handleOpeningBrace(nameNode, openBraceToken);
        _super.prototype.visitInterfaceDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitFunctionDeclaration = function (node) {
        this.handleFunctionLikeDeclaration(node);
        _super.prototype.visitFunctionDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitMethodDeclaration = function (node) {
        this.handleFunctionLikeDeclaration(node);
        _super.prototype.visitMethodDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitConstructorDeclaration = function (node) {
        this.handleFunctionLikeDeclaration(node);
        _super.prototype.visitConstructorDeclaration.call(this, node);
    };
    OneLineWalker.prototype.visitArrowFunction = function (node) {
        var body = node.body;
        if (body != null && body.kind === 163 /* Block */) {
            var arrowToken = OneLineWalker.getFirstChildOfKind(node, 31 /* EqualsGreaterThanToken */);
            var openBraceToken = node.body.getChildAt(0);
            this.handleOpeningBrace(arrowToken, openBraceToken);
        }
        _super.prototype.visitArrowFunction.call(this, node);
    };
    OneLineWalker.prototype.handleFunctionLikeDeclaration = function (node) {
        var body = node.body;
        if (body != null && body.kind === 163 /* Block */) {
            var openBraceToken = node.body.getChildAt(0);
            if (node.type != null) {
                this.handleOpeningBrace(node.type, openBraceToken);
            }
            else {
                var closeParenToken = OneLineWalker.getFirstChildOfKind(node, 16 /* CloseParenToken */);
                this.handleOpeningBrace(closeParenToken, openBraceToken);
            }
        }
    };
    OneLineWalker.prototype.handleIterationStatement = function (node) {
        var closeParenToken = node.getChildAt(node.getChildCount() - 2);
        var statement = node.statement;
        if (statement.kind === 163 /* Block */) {
            var openBraceToken = statement.getChildAt(0);
            if (!this.multilineAndAlignedBrace(node, closeParenToken, openBraceToken)) {
                this.handleOpeningBrace(closeParenToken, openBraceToken);
            }
        }
    };
    OneLineWalker.prototype.handleOpeningBrace = function (previousNode, openBraceToken) {
        if (previousNode == null || openBraceToken == null) {
            return;
        }
        var failure;
        if (this.hasOption(OPTION_BRACE) && !this.sameLine(previousNode, openBraceToken)) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.BRACE_FAILURE_STRING);
        }
        else if (this.hasOption(OPTION_WHITESPACE) && previousNode.getEnd() === openBraceToken.getStart()) {
            failure = this.createFailure(openBraceToken.getStart(), openBraceToken.getWidth(), Rule.WHITESPACE_FAILURE_STRING);
        }
        if (failure) {
            this.addFailure(failure);
        }
    };
    OneLineWalker.getFirstChildOfKind = function (node, kind) {
        return node.getChildren().filter(function (child) { return child.kind === kind; })[0];
    };
    OneLineWalker.prototype.sameLine = function (node1, node2) {
        var sourceFile = node1.getSourceFile();
        var line1 = sourceFile.getLineAndCharacterFromPosition(node1.getEnd()).line;
        var line2 = sourceFile.getLineAndCharacterFromPosition(node2.getStart()).line;
        return line1 === line2;
    };
    OneLineWalker.prototype.sameColumn = function (node1, node2) {
        var sourceFile = node1.getSourceFile();
        var col1 = sourceFile.getLineAndCharacterFromPosition(node1.getStart()).character;
        var col2 = sourceFile.getLineAndCharacterFromPosition(node2.getStart()).character;
        return col1 === col2;
    };
    OneLineWalker.prototype.multilineAndAlignedBrace = function (parentStmt, closeParen, openBrace) {
        return !this.sameLine(parentStmt.getChildAt(0), closeParen) && this.sameColumn(parentStmt, openBrace);
    };
    return OneLineWalker;
})(Lint.RuleWalker);
